import { BoundingBox, DetectedPothole } from '../types';

export interface PotholeTrack {
  trackId: string;
  firstSeenFrame: number;
  lastSeenFrame: number;
  hitCount: number;
  bestDetection: DetectedPothole;
  currentBox: BoundingBox;
}

export class PotholeMultiFrameTracker {
  private tracks: Map<string, PotholeTrack> = new Map();
  private nextTrackNumber: number = 1;
  private currentFrameIndex: number = 0;
  
  // Distance threshold in normalized 0-1000 space
  private readonly maxCentroidDistance = 140; 
  private readonly minIouThreshold = 0.20;

  public reset(): void {
    this.tracks.clear();
    this.nextTrackNumber = 1;
    this.currentFrameIndex = 0;
  }

  public update(detections: DetectedPothole[], frameIndex?: number): {
    uniqueTotalCount: number;
    annotatedDetections: DetectedPothole[];
    allUniquePotholes: DetectedPothole[];
  } {
    if (frameIndex !== undefined) {
      this.currentFrameIndex = frameIndex;
    } else {
      this.currentFrameIndex++;
    }

    const matchedTrackIds = new Set<string>();
    const annotated: DetectedPothole[] = [];

    for (const detection of detections) {
      let bestMatchId: string | null = null;
      let highestScore = -1;

      for (const [trackId, track] of this.tracks.entries()) {
        if (matchedTrackIds.has(trackId)) continue;

        // Only match tracks updated within the last 15 frames (~6-8 seconds)
        if (this.currentFrameIndex - track.lastSeenFrame > 15) continue;

        const iou = this.calculateIoU(detection.box2d, track.currentBox);
        const centroidDist = this.calculateCentroidDistance(detection.box2d, track.currentBox);

        // Combined score
        if (iou > this.minIouThreshold || centroidDist < this.maxCentroidDistance) {
          const score = iou * 0.6 + (1 - centroidDist / 1000) * 0.4;
          if (score > highestScore) {
            highestScore = score;
            bestMatchId = trackId;
          }
        }
      }

      if (bestMatchId) {
        // Matched existing pothole! Do not increment unique count
        matchedTrackIds.add(bestMatchId);
        const track = this.tracks.get(bestMatchId)!;
        track.lastSeenFrame = this.currentFrameIndex;
        track.hitCount++;
        track.currentBox = detection.box2d;

        // Keep best confidence detection info
        if (detection.confidence > track.bestDetection.confidence) {
          track.bestDetection = {
            ...detection,
            id: bestMatchId
          };
        }

        annotated.push({
          ...detection,
          id: bestMatchId,
          firstDetectedFrame: track.firstSeenFrame
        });
      } else {
        // New unique pothole
        const newTrackId = `P-${this.nextTrackNumber++}`;
        matchedTrackIds.add(newTrackId);

        const newDetection: DetectedPothole = {
          ...detection,
          id: newTrackId,
          firstDetectedFrame: this.currentFrameIndex
        };

        this.tracks.set(newTrackId, {
          trackId: newTrackId,
          firstSeenFrame: this.currentFrameIndex,
          lastSeenFrame: this.currentFrameIndex,
          hitCount: 1,
          bestDetection: newDetection,
          currentBox: detection.box2d
        });

        annotated.push(newDetection);
      }
    }

    const allUnique = Array.from(this.tracks.values()).map(t => t.bestDetection);

    return {
      uniqueTotalCount: this.tracks.size,
      annotatedDetections: annotated,
      allUniquePotholes: allUnique
    };
  }

  private calculateCentroidDistance(b1: BoundingBox, b2: BoundingBox): number {
    const c1x = (b1.xmin + b1.xmax) / 2;
    const c1y = (b1.ymin + b1.ymax) / 2;
    const c2x = (b2.xmin + b2.xmax) / 2;
    const c2y = (b2.ymin + b2.ymax) / 2;

    const dx = c1x - c2x;
    const dy = c1y - c2y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateIoU(b1: BoundingBox, b2: BoundingBox): number {
    const interXmin = Math.max(b1.xmin, b2.xmin);
    const interYmin = Math.max(b1.ymin, b2.ymin);
    const interXmax = Math.min(b1.xmax, b2.xmax);
    const interYmax = Math.min(b1.ymax, b2.ymax);

    const interWidth = Math.max(0, interXmax - interXmin);
    const interHeight = Math.max(0, interYmax - interYmin);
    const interArea = interWidth * interHeight;

    const b1Area = Math.max(0, b1.xmax - b1.xmin) * Math.max(0, b1.ymax - b1.ymin);
    const b2Area = Math.max(0, b2.xmax - b2.xmin) * Math.max(0, b2.ymax - b2.ymin);

    const unionArea = b1Area + b2Area - interArea;
    if (unionArea <= 0) return 0;
    return interArea / unionArea;
  }
}

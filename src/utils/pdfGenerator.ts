import { jsPDF } from 'jspdf';
import { RoadComplaintReport } from '../types';
import { formatInr } from './costCalculator';

export function generateComplaintPdf(report: RoadComplaintReport, lang: 'en' | 'hi' = 'en') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header bar
  doc.setFillColor(11, 19, 43); // Dark Navy #0B132B
  doc.rect(0, 0, pageWidth, 24, 'F');
  
  // Saffron & Green subtle accent line (Indian flag civic feel)
  doc.setFillColor(245, 158, 11); // Saffron/amber
  doc.rect(0, 24, pageWidth / 2, 2, 'F');
  doc.setFillColor(16, 185, 129); // Green
  doc.rect(pageWidth / 2, 24, pageWidth / 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ROADRAKSHAK AI - CITIZEN ROAD DEFECT & GRIEVANCE REPORT', 14, 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Pothole Computer Vision Detection & PWD Material Estimation System', 14, 18);

  // Reference & Metadata Badge
  let y = 35;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grievance Reference No: ${report.id}`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated On: ${new Date(report.createdAt).toLocaleString('en-IN')}`, 130, y);

  y += 7;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, pageWidth - 14, y);

  // Section 1: Location & Road Owning Authority
  y += 8;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 5, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. LOCATION & JURISDICTION DETAILS', 16, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Addressed To Authority:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.roadAuthority}`, 65, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Road Name / Highway:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.roadName}`, 65, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('State & District:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.state}, District: ${report.district}`, 65, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Landmark / Ward:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.landmark || 'Not specified'}`, 65, y);

  if (report.coordinates) {
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('GPS Geolocation:', 16, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lat ${report.coordinates.latitude.toFixed(6)}, Long ${report.coordinates.longitude.toFixed(6)} (Acc: ±${Math.round(report.coordinates.accuracy || 12)}m)`, 65, y);
  }

  // Section 2: Pothole & Road Condition Diagnosis
  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 5, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AI COMPUTER VISION INSPECTION FINDINGS', 16, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Unique Potholes Detected:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.scanResult.totalUniquePotholes} units`, 65, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Overall Road Condition:', 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.scanResult.overallCondition} (PCI: ${report.scanResult.pciScore}/100)`, 165, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Priority:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.scanResult.repairPriority}`, 65, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Commuter Hazard Level:', 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.scanResult.commuterSafetyRisk}`, 165, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Safety Risk Assessment:', 16, y);
  doc.setFont('helvetica', 'normal');
  const safetyLines = doc.splitTextToSize(report.scanResult.primaryRecommendation || 'High risk of two-wheeler skidding and vehicular axle damage.', pageWidth - 80);
  doc.text(safetyLines, 65, y);
  y += (safetyLines.length - 1) * 4;

  // Section 3: PWD Material Takeoff & Cost Estimation
  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 5, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. PWD MATERIAL & PRELIMINARY REPAIR COST ESTIMATE (IRC:SP:100)', 16, y);

  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Schedule of Rates Benchmark:', 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${report.costEstimate.scheduleName}`, 75, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`• Total Repair Area (inc. 15% saw-cut allowance): ${report.costEstimate.totalPatchAreaSqM} m²`, 16, y);
  doc.text(`• Compacted Asphalt Volume: ${report.costEstimate.totalPatchVolumeCuM} m³`, 120, y);

  y += 5;
  doc.text(`• Bituminous Concrete Mix (DBM/BC): ${report.costEstimate.asphaltTonnage} Tonnes (${formatInr(report.costEstimate.asphaltCost)})`, 16, y);
  doc.text(`• Tack Coat Emulsion (RS-1): ${report.costEstimate.tackCoatLitres} Litres (${formatInr(report.costEstimate.tackCoatCost)})`, 120, y);

  y += 5;
  doc.text(`• Crushed Aggregate Base: ${report.costEstimate.aggregateCuM} m³ (${formatInr(report.costEstimate.aggregateCost)})`, 16, y);
  doc.text(`• Labour (Mason & Crew): ${report.costEstimate.masonDays + report.costEstimate.labourDays} Mandays (${formatInr(report.costEstimate.masonCost + report.costEstimate.labourCost)})`, 120, y);

  y += 5;
  doc.text(`• Compactor & Cutter Machinery: ${formatInr(report.costEstimate.rollerCost + report.costEstimate.cutterCost)}`, 16, y);
  doc.text(`• Contractor Overhead & Contingency: ${formatInr(report.costEstimate.contingencyCost)}`, 120, y);

  y += 7;
  doc.setFillColor(254, 243, 199);
  doc.rect(14, y - 4, pageWidth - 28, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(`TOTAL ESTIMATED REPAIR BUDGET: ${formatInr(report.costEstimate.totalEstimatedCost)}`, 16, y + 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('(Preliminary engineering estimate per MoRTH specifications)', 115, y + 1);

  // Section 4: Citizen Statement
  y += 12;
  doc.setTextColor(15, 23, 42);
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 5, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. CITIZEN GRIEVANCE PETITION & OBSERVATIONS', 16, y);

  y += 8;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const citizenText = report.citizenDescription || 
    'The aforementioned road stretch possesses severe pothole distress resulting in continuous commuter hazards, vehicle damage, and heightened risk of fatal road accidents. Immediate inspection and bitumen patch rectification by the concerned authority is requested under Section 1988 of the Motor Vehicles Act and National Road Safety directives.';
  const wrappedCitizen = doc.splitTextToSize(citizenText, pageWidth - 32);
  doc.text(wrappedCitizen, 16, y);

  // Footer & Disclaimer
  const footerY = 275;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Generated via RoadRakshak AI Civic Technology Platform • Verified with Computer Vision & MoRTH Standards', 14, footerY);
  doc.text('Submit this certified dossier at pgportal.gov.in (CPGRAMS) or your local Municipal / PWD portal.', 14, footerY + 4);
  doc.text(`Report ID: ${report.id}`, pageWidth - 50, footerY);

  // Save the PDF
  doc.save(`RoadRakshak_Grievance_${report.id}.pdf`);
}

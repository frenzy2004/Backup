import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LocationAnalysis, Business } from '../types';

interface PDFExportOptions {
  location: string;
  businessType: string;
  analysis: LocationAnalysis;
  businesses: Business[];
  mapElementId?: string;
}

/**
 * Captures an HTML element as an image and returns the data URL
 */
const captureElement = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id "${elementId}" not found`);
    return null;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error(`Error capturing element ${elementId}:`, error);
    return null;
  }
};

/**
 * Adds a header to each page
 */
const addPageHeader = (pdf: jsPDF, pageNumber: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('BizLocate - Location Analysis Report', 10, 8);
  pdf.text(`Page ${pageNumber}`, pageWidth - 30, 8);
  pdf.setTextColor(0, 0, 0);
};

/**
 * Adds a section divider line
 */
const addSectionDivider = (pdf: jsPDF, yPos: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(0.5);
  pdf.line(10, yPos, pageWidth - 10, yPos);
};

/**
 * Load image from URL with CORS support
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Generates a comprehensive PDF report with images
 */
export const generateEnhancedPDF = async ({
  location,
  businessType,
  analysis,
  businesses,
  mapElementId,
}: PDFExportOptions): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let pageNumber = 1;

  // ===== TITLE PAGE =====
  addPageHeader(pdf, pageNumber);

  // Title
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246); // Primary blue
  pdf.text('Location Analysis Report', margin, 40);

  // Subtitle
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Comprehensive Business Location Assessment', margin, 52);

  // Location details box
  pdf.setFillColor(245, 247, 250);
  pdf.roundedRect(margin, 70, contentWidth, 40, 3, 3, 'F');

  pdf.setFontSize(11);
  pdf.setTextColor(50, 50, 50);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Location:', margin + 5, 80);
  pdf.setFont('helvetica', 'normal');
  pdf.text(location, margin + 5, 88);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Business Type:', margin + 5, 96);
  pdf.setFont('helvetica', 'normal');
  pdf.text(businessType, margin + 5, 104);

  // Generated date
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 15);

  // Success Score - Large display
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(50, 50, 50);
  pdf.text('Overall Success Score', margin, 135);

  // Score circle background
  const scoreX = pageWidth / 2;
  const scoreY = 165;
  const scoreRadius = 25;

  // Determine color based on score
  let scoreColor: [number, number, number] = [239, 68, 68]; // Red
  if (analysis.successScore >= 70) scoreColor = [34, 197, 94]; // Green
  else if (analysis.successScore >= 50) scoreColor = [251, 146, 60]; // Orange

  pdf.setFillColor(...scoreColor);
  pdf.circle(scoreX, scoreY, scoreRadius, 'F');

  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  const scoreText = `${analysis.successScore}`;
  const scoreTextWidth = pdf.getTextWidth(scoreText);
  pdf.text(scoreText, scoreX - scoreTextWidth / 2, scoreY + 5);

  pdf.setFontSize(10);
  pdf.text('/100', scoreX - scoreTextWidth / 2 + pdf.getTextWidth(scoreText) + 2, scoreY + 5);

  // ===== PAGE 2: KEY PERFORMANCE INDICATORS =====
  pdf.addPage();
  pageNumber++;
  addPageHeader(pdf, pageNumber);

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(50, 50, 50);
  pdf.text('Key Performance Indicators', margin, 25);

  let yPos = 40;

  const kpis = [
    { label: 'Average Rating', value: `${analysis.kpis.avgRating.toFixed(1)}/5`, icon: '⭐' },
    { label: 'Monthly Demand', value: analysis.kpis.monthlyDemand.toLocaleString(), icon: '📊' },
    { label: 'Competitor Count', value: analysis.kpis.competitorCount.toString(), icon: '🏢' },
    { label: 'Revenue Potential', value: `RM ${analysis.kpis.revenuePotential.toLocaleString()}`, icon: '💰' },
    { label: 'Rent Sensitivity', value: `${analysis.kpis.rentSensitivity}%`, icon: '🏠' },
  ];

  kpis.forEach((kpi, index) => {
    const boxY = yPos + (index * 35);

    // KPI Box
    pdf.setFillColor(250, 250, 251);
    pdf.roundedRect(margin, boxY, contentWidth, 28, 2, 2, 'F');

    // Icon
    pdf.setFontSize(20);
    pdf.text(kpi.icon, margin + 5, boxY + 18);

    // Label
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text(kpi.label, margin + 20, boxY + 12);

    // Value
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text(kpi.value, margin + 20, boxY + 22);
  });

  // ===== PAGE 3: DEMOGRAPHICS & LOCATION PROFILE =====
  pdf.addPage();
  pageNumber++;
  addPageHeader(pdf, pageNumber);

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(50, 50, 50);
  pdf.text('Demographics & Location Profile', margin, 25);

  yPos = 40;

  // Demographics section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Demographics Breakdown', margin, yPos);

  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Office Workers: ${analysis.demographics.office}%`, margin + 5, yPos);

  // Office workers bar
  const barWidth = (contentWidth - 10) * (analysis.demographics.office / 100);
  pdf.setFillColor(59, 130, 246);
  pdf.rect(margin + 5, yPos + 3, barWidth, 4, 'F');

  yPos += 15;
  pdf.text(`Residents: ${analysis.demographics.residents}%`, margin + 5, yPos);

  // Residents bar
  const barWidth2 = (contentWidth - 10) * (analysis.demographics.residents / 100);
  pdf.setFillColor(139, 92, 246);
  pdf.rect(margin + 5, yPos + 3, barWidth2, 4, 'F');

  yPos += 25;
  addSectionDivider(pdf, yPos);

  // Location Profile
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(50, 50, 50);
  pdf.text('Location Profile Metrics', margin, yPos);

  yPos += 10;
  const profileMetrics = [
    { label: 'Average Age', value: analysis.locationProfile.age },
    { label: 'Income Level', value: analysis.locationProfile.income },
    { label: 'Family Size', value: analysis.locationProfile.familySize },
    { label: 'Daytime Population', value: analysis.locationProfile.daytimePop },
    { label: 'Accessibility', value: analysis.locationProfile.accessibility },
  ];

  profileMetrics.forEach((metric) => {
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${metric.label}:`, margin + 5, yPos);
    pdf.text(`${metric.value}/10`, pageWidth - margin - 20, yPos, { align: 'right' });
  });

  // ===== PAGE 4: CHARTS (If chart elements exist) =====
  const chartIds = [
    'success-score-chart',
    'seasonal-demand-chart',
    'demographic-chart',
    'competitor-chart',
    'location-profile-chart',
    'competition-density-chart',
  ];

  for (const chartId of chartIds) {
    const chartImage = await captureElement(chartId);
    if (chartImage) {
      pdf.addPage();
      pageNumber++;
      addPageHeader(pdf, pageNumber);

      const chartTitle = chartId
        .replace('-chart', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50, 50, 50);
      pdf.text(chartTitle, margin, 25);

      // Add chart image (fit to page width)
      const imgWidth = contentWidth;
      const imgHeight = (imgWidth * 3) / 4; // Maintain aspect ratio
      pdf.addImage(chartImage, 'PNG', margin, 35, imgWidth, imgHeight);
    }
  }

  // ===== MAP SNAPSHOT =====
  if (mapElementId) {
    const mapImage = await captureElement(mapElementId);
    if (mapImage) {
      pdf.addPage();
      pageNumber++;
      addPageHeader(pdf, pageNumber);

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50, 50, 50);
      pdf.text('Location Map', margin, 25);

      const imgWidth = contentWidth;
      const imgHeight = imgWidth * 0.75;
      pdf.addImage(mapImage, 'PNG', margin, 35, imgWidth, imgHeight);
    }
  }

  // ===== BUSINESS LISTINGS =====
  if (businesses.length > 0) {
    pdf.addPage();
    pageNumber++;
    addPageHeader(pdf, pageNumber);

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text('Nearby Competitors', margin, 25);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text(`${businesses.length} businesses found within 1km radius`, margin, 33);

    yPos = 45;
    const itemsPerPage = 4;

    for (let i = 0; i < Math.min(businesses.length, 12); i++) {
      const business = businesses[i];

      // Add new page if needed
      if (i > 0 && i % itemsPerPage === 0) {
        pdf.addPage();
        pageNumber++;
        addPageHeader(pdf, pageNumber);
        yPos = 20;
      }

      const boxHeight = 45;
      const boxY = yPos + ((i % itemsPerPage) * (boxHeight + 8));

      // Business card background
      pdf.setFillColor(249, 250, 251);
      pdf.roundedRect(margin, boxY, contentWidth, boxHeight, 2, 2, 'F');

      // Try to add thumbnail
      try {
        if (business.thumbnail && !business.thumbnail.includes('pexels')) {
          const img = await loadImage(business.thumbnail);
          pdf.addImage(img, 'JPEG', margin + 3, boxY + 3, 25, 25);
        }
      } catch (err) {
        // Skip thumbnail if loading fails
        console.warn(`Failed to load thumbnail for ${business.name}`);
      }

      // Business info
      const textX = margin + 32;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50, 50, 50);
      pdf.text(business.name, textX, boxY + 8, { maxWidth: contentWidth - 40 });

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(business.category, textX, boxY + 15);

      pdf.setFontSize(8);
      pdf.text(business.address.substring(0, 60), textX, boxY + 21, { maxWidth: contentWidth - 40 });

      // Rating
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(251, 146, 60);
      pdf.text(`⭐ ${business.rating.toFixed(1)}`, textX, boxY + 30);

      // Distance
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`📍 ${business.distance.toFixed(2)} km`, textX + 25, boxY + 30);
    }
  }

  // ===== FOOTER PAGE =====
  pdf.addPage();
  pageNumber++;
  addPageHeader(pdf, pageNumber);

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(50, 50, 50);
  pdf.text('Report Summary', margin, 30);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(80, 80, 80);

  const summaryText = `This comprehensive location analysis report provides data-driven insights for establishing a ${businessType} business at ${location}. The analysis includes demographic data, competitor analysis, accessibility metrics, and revenue projections based on current market conditions.`;

  const splitText = pdf.splitTextToSize(summaryText, contentWidth);
  pdf.text(splitText, margin, 45);

  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text('Generated by BizLocate - Location Analysis Platform', margin, pageHeight - 20);
  pdf.text('For more information, visit bizlocate.com', margin, pageHeight - 15);

  // Save PDF
  const fileName = `location-analysis-${location.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.pdf`;
  pdf.save(fileName);
};

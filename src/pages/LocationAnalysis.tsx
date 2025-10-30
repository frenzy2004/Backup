import React, { useState, useEffect } from 'react';
import { Menu, X, Download, ArrowLeft, Map, BarChart3, Leaf, Activity, GitCompare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from '../lib/utils';
import GoogleMap from '../components/GoogleMap';
import TabNavigation from '../components/TabNavigation';
import SeasonalDemandChart from '../components/charts/SeasonalDemandChart';
import DemographicChart from '../components/charts/DemographicChart';
import CompetitorChart from '../components/charts/CompetitorChart';
import LocationProfileChart from '../components/charts/LocationProfileChart';
import CompetitionDensityChart from '../components/charts/CompetitionDensityChart';
import SuccessScoreChart from '../components/charts/SuccessScoreChart';
import BusinessCard from '../components/BusinessCard';
import BusinessDetail from '../components/BusinessDetail';
import AIAssistant from '../components/AIAssistant';
import KPICards from '../components/KPICards';
import RentLocationContent from '../components/RentLocationContent';
import { LocationAnalysis as LocationAnalysisType, Business, AnalysisTab, Location } from '../types';
import { mockAnalysis } from '../data/mockData';
import { geocodeLocation } from '../utils/geocoding';
import { findNearbyBusinesses } from '../utils/placesService';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { generateEnhancedPDF } from '../utils/pdfExport';

interface LocationAnalysisProps {
  location: string;
  businessType: string;
  onBack: () => void;
  tabs: AnalysisTab[];
  activeTabId: string | null;
  onTabSwitch: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewComparison: () => void;
}

const LocationAnalysis: React.FC<LocationAnalysisProps> = ({
  location,
  businessType,
  onBack,
  tabs,
  activeTabId,
  onTabSwitch,
  onTabClose,
  onNewComparison,
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'analytics' | 'ndvi'>('map');
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'rent' | 'ai-insight'>('overview');
  const [satelliteView, setSatelliteView] = useState<'before' | 'after' | 'changes' | 'split'>('split');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [actualLocation, setActualLocation] = useState<Location | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { isLoaded } = useGoogleMaps();

  // Geocode the location when component mounts or location changes
  useEffect(() => {
    const getLocationCoordinates = async () => {
      if (!isLoaded) return;
      
      setIsGeocoding(true);
      const geocodedLocation = await geocodeLocation(location);
      
      let finalLocation: Location;
      if (geocodedLocation) {
        finalLocation = geocodedLocation;
      } else {
        // Fallback to mock location if geocoding fails
        finalLocation = { ...mockAnalysis.location, address: location };
      }
      
      setActualLocation(finalLocation);
      
      // Find real businesses using Places API
      const realBusinesses = await findNearbyBusinesses(finalLocation, businessType);
      setBusinesses(realBusinesses);
      
      setIsGeocoding(false);
    };

    getLocationCoordinates();
  }, [location, businessType, isLoaded]);

  const analysis: LocationAnalysisType = {
    ...mockAnalysis,
    location: actualLocation || { ...mockAnalysis.location, address: location },
    businessType,
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleRecenterMap = (_business: Business) => {
    setSelectedBusiness(null);
    // Map will automatically update with the business location
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateEnhancedPDF({
        location,
        businessType,
        analysis,
        businesses,
        mapElementId: 'google-map-container',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex">
      {/* LEFT SIDEBAR - AI Chat (EXACT GARUDA SPECS: w-2/5) */}
      <div className="hidden lg:flex w-2/5 h-full border-r border-border/50 bg-card flex-col">
        {/* Logo Header - FIXED/STATIC */}
        <div className="border-b border-border/50 p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="btn-icon btn-ghost"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Map className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">BizLocate</h1>
              <p className="text-sm max-w-sm text-muted-foreground">Ask questions about location analysis using satellite imagery</p>
            </div>
          </div>
        </div>

        {/* AI Chat Area - SCROLLABLE */}
        <div className="flex-1 overflow-hidden">
          <AIAssistant />
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as 'map' | 'analytics' | 'ndvi')}
          className="w-full h-full flex flex-col"
        >
          {/* Tab Navigation - EXACT Garuda spacing */}
          <div className="flex-shrink-0 border-b border-border/50 bg-card">
            <div className="px-6 py-[22px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TabsList className="grid w-full max-w-lg grid-cols-3 bg-card/30 border border-border/50">
                  <TabsTrigger
                    value="map"
                    className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Map className="h-4 w-4" />
                    <span className="font-medium">Map View</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ndvi"
                    className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                  >
                    <Leaf className="h-4 w-4" />
                    <span className="font-medium">Urban Development</span>
                  </TabsTrigger>
                </TabsList>

                {/* Comparison Tabs or Status Indicators */}
                <div className="ml-2 flex items-center space-x-4 text-sm text-muted-foreground">
                  {tabs.length > 1 ? (
                    // Show comparison tabs when multiple analyses exist
                    <div className="flex items-center gap-2">
                      {tabs.map((tab, index) => (
                        <button
                          key={tab.id}
                          onClick={() => onTabSwitch(tab.id)}
                          className={cn(
                            "px-3 py-1 rounded-md text-xs font-medium transition-all duration-200",
                            tab.id === activeTabId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Show status indicators when single analysis
                    <>
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors duration-200",
                            businesses.length > 0 ? "bg-success animate-pulse" : "bg-muted"
                          )}
                        />
                        <span>{businesses.length > 0 ? `${businesses.length} businesses loaded` : "Loading data..."}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-3 w-3" />
                        <span>
                          {activeView === "map"
                            ? "Interactive mapping"
                            : activeView === "analytics"
                            ? "Live analytics"
                            : "NDVI analysis"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onNewComparison}
                  className="btn-icon btn-ghost"
                  title="Compare locations"
                >
                  <GitCompare className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="btn-icon btn-ghost"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="btn-icon btn-ghost lg:hidden"
                >
                  {isPanelOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content with Animations */}
          <AnimatePresence mode="wait">
            <TabsContent value="map" className="flex-1 m-0 h-full overflow-hidden">
              <motion.div
                key="map-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {isGeocoding ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                      <div className="text-muted-foreground">Analyzing location data...</div>
                    </div>
                  </div>
                ) : (
                  <div id="google-map-container" className="h-full">
                    <GoogleMap
                      location={actualLocation!}
                      businesses={businesses}
                      onBusinessClick={handleBusinessClick}
                      className="h-full w-full"
                    />
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 m-0 h-full overflow-y-auto">
              <motion.div
                key="analytics-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {/* Sub-tabs for Analytics - SCROLLS WITH CONTENT */}
                <div className="border-b border-border bg-background px-6 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-2 text-sm font-medium transition-all relative ${
                        activeTab === 'overview' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Overview
                      {activeTab === 'overview' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('businesses')}
                      className={`px-4 py-2 text-sm font-medium transition-all relative ${
                        activeTab === 'businesses' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Competitor Nearby
                      {activeTab === 'businesses' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('rent')}
                      className={`px-4 py-2 text-sm font-medium transition-all relative ${
                        activeTab === 'rent' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Rent Location
                      {activeTab === 'rent' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('ai-insight')}
                      className={`px-4 py-2 text-sm font-medium transition-all relative ${
                        activeTab === 'ai-insight' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Satellite Data
                      {activeTab === 'ai-insight' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div className="p-6 space-y-6">
                      {/* Statistics Header Section - Garuda Style */}
                      <div className="card-elevated p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Map className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-foreground">Location Analysis Complete</h2>
                            <p className="text-sm text-muted-foreground">AI-powered insights with comprehensive data</p>
                          </div>
                        </div>

                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 bg-background-alt rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-success"></div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Success Score</span>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{analysis.successScore}%</div>
                          </div>
                          <div className="p-4 bg-background-alt rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-accent"></div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Competitors</span>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{businesses.length}</div>
                          </div>
                          <div className="p-4 bg-background-alt rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Analysis Type</span>
                            </div>
                            <div className="text-sm font-bold text-foreground">Location Intelligence</div>
                          </div>
                          <div className="p-4 bg-background-alt rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full bg-warning"></div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Data Quality</span>
                            </div>
                            <div className="text-sm font-bold text-success">High (92%)</div>
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis Insights */}
                      <div className="card p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          <h3 className="text-lg font-semibold text-foreground">AI Analysis Insights</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                            <span className="text-success font-bold">✓</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">High-Quality Location Data</p>
                              <p className="text-xs text-muted-foreground">Real-time analysis with comprehensive market insights</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <span className="text-primary font-bold">★</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">AI-Enhanced Analytics</p>
                              <p className="text-xs text-muted-foreground">Machine learning models provide advanced pattern detection</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                            <span className="text-accent font-bold">◆</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">Market Trends Analysis</p>
                              <p className="text-xs text-muted-foreground">Seasonal patterns and demographic insights detected</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <KPICards kpis={analysis.kpis} />

                      <div id="success-score-chart">
                        <SuccessScoreChart score={analysis.successScore} />
                      </div>

                      <div id="seasonal-demand-chart">
                        <SeasonalDemandChart data={analysis.seasonalDemand} />
                      </div>

                      <div id="demographic-chart">
                        <DemographicChart data={analysis.demographics} />
                      </div>

                      <div id="competitor-chart">
                        <CompetitorChart data={analysis.competitors} />
                      </div>

                      <div id="location-profile-chart">
                        <LocationProfileChart data={analysis.locationProfile} />
                      </div>

                      <div id="competition-density-chart">
                        <CompetitionDensityChart data={analysis.competitionDensity} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'businesses' && (
                    <div className="p-6 space-y-4">
                      <div className="card p-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Competitor Analysis</h3>
                          <p className="text-sm text-muted-foreground">{businesses.length} businesses found within 1km radius</p>
                        </div>
                        <div className="badge-accent">
                          <span className="text-xs font-medium">Live Data</span>
                        </div>
                      </div>
                      {businesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          onClick={handleBusinessClick}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'rent' && (
                    <div className="p-6">
                      <div className="card p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          <h3 className="text-lg font-semibold text-foreground">Market Data & Rent Analysis</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Real estate and rental market insights for this location</p>
                      </div>
                      <RentLocationContent location={location} businessType={businessType} />
                    </div>
                  )}

                  {activeTab === 'ai-insight' && (
                    <div className="pb-6">
                      {/* Header Section */}
                      <div className="p-6 pb-4 border-b border-border bg-background">
                        <div className="mb-2">
                          <h3 className="text-xl font-bold text-foreground">Satellite Analysis</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {location} • 2017-04-10 to 2025-04-28
                        </p>
                      </div>

                      {/* View Mode Tabs */}
                      <div className="px-6 py-4 border-b border-border bg-background">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSatelliteView('before')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              satelliteView === 'before'
                                ? 'bg-background text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            Before
                          </button>
                          <button
                            onClick={() => setSatelliteView('after')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              satelliteView === 'after'
                                ? 'bg-background text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            After
                          </button>
                          <button
                            onClick={() => setSatelliteView('changes')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              satelliteView === 'changes'
                                ? 'bg-background text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            Changes
                          </button>
                          <button
                            onClick={() => setSatelliteView('split')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              satelliteView === 'split'
                                ? 'bg-background text-foreground shadow-sm border border-border'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            Split View
                          </button>
                        </div>
                      </div>

                      {/* Satellite Imagery Display */}
                      <div className="p-6">
                        {satelliteView === 'split' && (
                          <div className="grid grid-cols-2 gap-4 min-h-[600px]">
                            {/* Before Image */}
                            <div className="relative rounded-lg overflow-hidden bg-background-elevated border border-border group">
                              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background rounded-md border border-border">
                                <span className="text-sm font-medium text-foreground">Before</span>
                                <span className="text-xs text-muted-foreground ml-2">2017-04-10</span>
                              </div>
                              <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-gradient-to-br from-orange-900/20 to-orange-700/20">
                                <div className="text-center p-8">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <span className="text-3xl">🛰️</span>
                                  </div>
                                  <p className="text-muted-foreground text-sm">Satellite imagery for {location}</p>
                                  <p className="text-muted-foreground text-xs mt-1">Before: April 2017</p>
                                </div>
                              </div>
                            </div>

                            {/* After Image */}
                            <div className="relative rounded-lg overflow-hidden bg-background-elevated border border-border group">
                              <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background rounded-md border border-border">
                                <span className="text-sm font-medium text-foreground">After</span>
                                <span className="text-xs text-muted-foreground ml-2">2025-04-28</span>
                              </div>
                              <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-gradient-to-br from-green-900/20 to-yellow-700/20">
                                <div className="text-center p-8">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="text-3xl">🌆</span>
                                  </div>
                                  <p className="text-muted-foreground text-sm">Satellite imagery for {location}</p>
                                  <p className="text-muted-foreground text-xs mt-1">After: April 2025</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {satelliteView === 'before' && (
                          <div className="relative rounded-lg overflow-hidden bg-background-elevated border border-border h-full min-h-[500px]">
                            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background rounded-md border border-border">
                              <span className="text-sm font-medium text-foreground">Before</span>
                              <span className="text-xs text-muted-foreground ml-2">2017-04-10</span>
                            </div>
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-orange-700/20">
                              <div className="text-center p-8">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                                  <span className="text-4xl">🛰️</span>
                                </div>
                                <p className="text-foreground text-lg font-medium mb-2">Before: April 2017</p>
                                <p className="text-muted-foreground text-sm">Historical satellite view of {location}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {satelliteView === 'after' && (
                          <div className="relative rounded-lg overflow-hidden bg-background-elevated border border-border h-full min-h-[500px]">
                            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background rounded-md border border-border">
                              <span className="text-sm font-medium text-foreground">After</span>
                              <span className="text-xs text-muted-foreground ml-2">2025-04-28</span>
                            </div>
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-900/20 to-yellow-700/20">
                              <div className="text-center p-8">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                  <span className="text-4xl">🌆</span>
                                </div>
                                <p className="text-foreground text-lg font-medium mb-2">After: April 2025</p>
                                <p className="text-muted-foreground text-sm">Current satellite view of {location}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {satelliteView === 'changes' && (
                          <div className="relative rounded-lg overflow-hidden bg-background-elevated border border-border h-full min-h-[500px]">
                            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-background rounded-md border border-border">
                              <span className="text-sm font-medium text-foreground">Changes Detected</span>
                            </div>
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-700/20">
                              <div className="text-center p-8">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                  <span className="text-4xl">📊</span>
                                </div>
                                <p className="text-foreground text-lg font-medium mb-2">Change Detection Analysis</p>
                                <p className="text-muted-foreground text-sm mb-6">2017-04-10 to 2025-04-28</p>
                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                                    <div className="text-2xl font-bold text-success">+42%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Urban Growth</div>
                                  </div>
                                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                                    <div className="text-2xl font-bold text-warning">-18%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Green Cover</div>
                                  </div>
                                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                                    <div className="text-2xl font-bold text-accent">+65%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Infrastructure</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="ndvi" className="flex-1 m-0 h-full overflow-auto">
              <motion.div
                key="ndvi-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <div className="card p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">NDVI & Environmental Analysis</h3>
                    </div>
                    <p className="text-muted-foreground">Vegetation index and environmental insights for this location</p>
                  </div>
                  <div className="grid gap-4">
                    <div className="p-5 bg-background-elevated rounded-lg border border-border hover:border-primary/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">Vegetation Coverage</h4>
                          <p className="text-sm text-muted-foreground mb-3">Analysis of green spaces and vegetation density</p>
                          <div className="flex items-center gap-2">
                            <div className="badge-success">
                              <span className="text-xs">Moderate Coverage</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 bg-background-elevated rounded-lg border border-border hover:border-primary/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent text-xl">🌡️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">Urban Heat Index</h4>
                          <p className="text-sm text-muted-foreground mb-3">Temperature patterns and heat island effects</p>
                          <div className="flex items-center gap-2">
                            <div className="badge-accent">
                              <span className="text-xs">Moderate Heat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 bg-background-elevated rounded-lg border border-border hover:border-primary/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xl">💧</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">Water Bodies</h4>
                          <p className="text-sm text-muted-foreground mb-3">Proximity to rivers, lakes, and water sources</p>
                          <div className="flex items-center gap-2">
                            <div className="badge-primary">
                              <span className="text-xs">Within 2km</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Mobile Analysis Panel Overlay */}
        {isPanelOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-background">
            <div className="h-full flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsPanelOpen(false)}
                    className="btn-icon btn-ghost"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center">
                    <h2 className="text-lg font-semibold text-foreground">Analysis Dashboard</h2>
                    <p className="text-sm text-muted-foreground">{businessType} in {location}</p>
                  </div>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="bg-background border-b border-border px-4 py-2">
                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('businesses')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'businesses'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Businesses
                  </button>
                  <button
                    onClick={() => setActiveTab('rent')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'rent'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-insight')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === 'ai-insight'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    AI Chat
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'overview' ? (
                  <div className="p-6 space-y-8">
                    <div id="success-score-chart-mobile">
                      <SuccessScoreChart score={analysis.successScore} />
                    </div>
                    <KPICards kpis={analysis.kpis} />
                    <div id="seasonal-demand-chart-mobile">
                      <SeasonalDemandChart data={analysis.seasonalDemand} />
                    </div>
                    <div id="demographic-chart-mobile">
                      <DemographicChart data={analysis.demographics} />
                    </div>
                    <div id="competitor-chart-mobile">
                      <CompetitorChart data={analysis.competitors} />
                    </div>
                    <div id="location-profile-chart-mobile">
                      <LocationProfileChart data={analysis.locationProfile} />
                    </div>
                    <div id="competition-density-chart-mobile">
                      <CompetitionDensityChart data={analysis.competitionDensity} />
                    </div>
                  </div>
                ) : activeTab === 'businesses' ? (
                  <div className="p-6 space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      {businesses.length} businesses found within 1km radius
                    </div>
                    {businesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        onClick={handleBusinessClick}
                      />
                    ))}
                  </div>
                ) : activeTab === 'rent' ? (
                  <div className="p-6">
                    <RentLocationContent location={location} businessType={businessType} />
                  </div>
                ) : activeTab === 'ai-insight' ? (
                  <div className="h-full">
                    <AIAssistant onClose={() => setActiveTab('overview')} />
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Urban Development Analysis</h3>
                        <p className="text-muted-foreground">Infrastructure and development insights for this location.</p>
                      </div>
                      <div className="grid gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Public Transportation</h4>
                          <p className="text-sm text-muted-foreground">Analysis of nearby transit options and accessibility.</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Future Developments</h4>
                          <p className="text-sm text-muted-foreground">Planned infrastructure and construction projects in the area.</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">Amenities</h4>
                          <p className="text-sm text-muted-foreground">Nearby facilities, parks, schools, and shopping centers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Hamburger Button for Mobile */}
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="fixed top-32 left-4 z-10 p-3 bg-background rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden btn-icon"
          aria-label="Open analysis panel"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Modals */}
      {selectedBusiness && (
        <BusinessDetail
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onRecenter={handleRecenterMap}
        />
      )}
    </div>
  );
};

export default LocationAnalysis;
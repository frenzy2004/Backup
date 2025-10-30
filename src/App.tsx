import { useState } from 'react';
import LocationRequest from './pages/LocationRequest';
import LocationAnalysis from './pages/LocationAnalysis';
import { AnalysisTab } from './types';

type AppState = 'request' | 'analysis';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('request');
  const [analysisTabs, setAnalysisTabs] = useState<AnalysisTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const handleLocationSubmit = (location: string, businessType: string) => {
    const newTab: AnalysisTab = {
      id: Date.now().toString(),
      label: `Analysis ${analysisTabs.length + 1}`,
      location,
      businessType,
      isActive: true,
      createdAt: new Date(),
    };

    // Mark all existing tabs as inactive
    const updatedTabs = analysisTabs.map(tab => ({ ...tab, isActive: false }));
    
    setAnalysisTabs([...updatedTabs, newTab]);
    setActiveTabId(newTab.id);
    setCurrentPage('analysis');
  };

  const handleBackToRequest = () => {
    setCurrentPage('request');
  };

  const handleTabSwitch = (tabId: string) => {
    setAnalysisTabs(tabs => 
      tabs.map(tab => ({ ...tab, isActive: tab.id === tabId }))
    );
    setActiveTabId(tabId);
  };

  const handleTabClose = (tabId: string) => {
    const updatedTabs = analysisTabs.filter(tab => tab.id !== tabId);
    
    if (updatedTabs.length === 0) {
      setCurrentPage('request');
      setActiveTabId(null);
    } else {
      // If we're closing the active tab, switch to the first remaining tab
      if (activeTabId === tabId) {
        const newActiveTab = updatedTabs[0];
        newActiveTab.isActive = true;
        setActiveTabId(newActiveTab.id);
      }
    }
    
    setAnalysisTabs(updatedTabs);
  };

  const handleNewComparison = () => {
    setCurrentPage('request');
  };

  const activeTab = analysisTabs.find(tab => tab.id === activeTabId);

  return (
    <div className="App">
      {currentPage === 'request' && (
        <LocationRequest onSubmit={handleLocationSubmit} />
      )}
      
      {currentPage === 'analysis' && activeTab && (
        <LocationAnalysis
          location={activeTab.location}
          businessType={activeTab.businessType}
          onBack={handleBackToRequest}
          tabs={analysisTabs}
          activeTabId={activeTabId}
          onTabSwitch={handleTabSwitch}
          onTabClose={handleTabClose}
          onNewComparison={handleNewComparison}
        />
      )}
    </div>
  );
}

export default App;
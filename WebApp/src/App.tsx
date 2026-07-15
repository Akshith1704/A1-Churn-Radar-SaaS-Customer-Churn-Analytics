/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import CustomerAnalyticsView from './components/CustomerAnalyticsView';
import ChurnPredictionView from './components/ChurnPredictionView';
import BusinessInsightsView from './components/BusinessInsightsView';
import ReportsView from './components/ReportsView';
import AboutView from './components/AboutView';
import { Customer, TabType } from './types';
import { defaultCsvText } from './data/defaultCsvData';
import { parseCSV } from './utils/csvParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [data, setData] = useState<Customer[]>([]);
  const [selectedCustomerID, setSelectedCustomerID] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default data on startup
  useEffect(() => {
    try {
      const parsed = parseCSV(defaultCsvText);
      setData(parsed);
    } catch (err) {
      console.error('Error loading default dataset:', err);
    }
  }, []);

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    setUploadSuccess(null);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processFile(file);
    } else {
      setUploadError('Invalid file type. Please upload a structured .csv dataset.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setData(parsed);
          setUploadSuccess(`Successfully loaded ${parsed.length} customer records from "${file.name}"!`);
          setTimeout(() => setUploadSuccess(null), 4000);
        } else {
          setUploadError('CSV parsed successfully but returned 0 valid customer records. Verify column headers.');
        }
      } catch (err) {
        setUploadError('Error parsing CSV dataset. Verify format compliance.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaultData = () => {
    try {
      const parsed = parseCSV(defaultCsvText);
      setData(parsed);
      setUploadSuccess('Successfully reset to the default 100+ row Churn dataset!');
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Safe navigation helper that sets state and tab when inspecting a specific customer profile
  const handleSelectCustomer = (customerID: string) => {
    setSelectedCustomerID(customerID);
    setActiveTab('analytics');
  };

  return (
    <div className="flex bg-[#0B1026] text-white min-h-screen font-sans antialiased overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header Controls Bar */}
        <header className="h-16 border-b border-white/5 bg-[#080C1D]/60 backdrop-blur-md flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="text-xs font-semibold text-[#00C8FF] tracking-wider uppercase font-mono">
            {activeTab.replace('_', ' ')} Pane
          </div>
          
          {/* Dynamic Dataset Actions (Upload CSV, Drag/Drop zone, Reset to Default) */}
          <div className="flex items-center gap-3">
            {/* Feedback Banners */}
            {uploadSuccess && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-fade-in font-sans">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{uploadSuccess}</span>
              </div>
            )}
            {uploadError && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl animate-fade-in font-sans">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Reset to Default Button */}
            <button 
              onClick={resetToDefaultData}
              title="Reset to default Telco Customer Dataset"
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Custom File Upload Button with Drag and Drop capability */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                isDragging 
                  ? 'bg-[#00C8FF]/10 border-[#00C8FF] text-white animate-pulse' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#00C8FF]" />
              <span>{isDragging ? 'Drop CSV File Here' : 'Upload custom CSV'}</span>
              <input 
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content Views */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              data={data} 
              onSelectCustomer={handleSelectCustomer} 
            />
          )}
          {activeTab === 'analytics' && (
            <CustomerAnalyticsView 
              data={data} 
              selectedCustomerID={selectedCustomerID}
              setSelectedCustomerID={setSelectedCustomerID}
            />
          )}
          {activeTab === 'prediction' && (
            <ChurnPredictionView />
          )}
          {activeTab === 'insights' && (
            <BusinessInsightsView data={data} />
          )}
          {activeTab === 'reports' && (
            <ReportsView data={data} />
          )}
          {activeTab === 'about' && (
            <AboutView />
          )}
        </main>
      </div>
    </div>
  );
}

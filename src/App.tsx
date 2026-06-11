/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent, FormEvent } from "react";
import {
  Briefcase,
  Shield,
  CheckCircle2,
  Building2,
  Globe,
  ChevronRight,
  UploadCloud,
  Send,
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  Menu,
  X,
  ArrowUpRight,
  HardHat,
  Flame,
  Wrench,
  Cpu,
  Zap,
  Settings,
  Scale,
  Warehouse,
  FileCheck,
  Search,
  BadgeAlert,
  Loader2,
  ArrowRight,
  Database,
  Lock,
  ExternalLink,
  Power,
  Thermometer,
  ShieldCheck,
  Truck,
  Layers,
  FileSpreadsheet,
  Clock,
  Award
} from "lucide-react";

import { COMPANY_STATS, SERVICES_DATA, INDUSTRIES_DATA, PROJECTS_DATA } from "./data";
import { RFQFormState, SupplierFormState, ContactFormState, ServerSubmission } from "./types";

export default function App() {
  // Navigation State representing structured corporate subpages
  const [activeTab, setActiveTab] = useState<"home" | "about" | "services" | "industries" | "supplier-network" | "rfq" | "contact">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter Services State in Services View
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Selection state for quick interactive details on industries or project case studies
  const [selectedIndustryInDetail, setSelectedIndustryInDetail] = useState(INDUSTRIES_DATA[0].id);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  // Search through services & industries
  const [searchQuery, setSearchQuery] = useState("");

  // Submissions state parsed from server API for transparent review
  const [submissionsList, setSubmissionsList] = useState<ServerSubmission[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Form Submitting and Feedback states
  const [submittingRfq, setSubmittingRfq] = useState(false);
  const [rfqSuccessMsg, setRfqSuccessMsg] = useState<string | null>(null);
  const [rfqError, setRfqError] = useState<string | null>(null);

  const [submittingSupplier, setSubmittingSupplier] = useState(false);
  const [supplierSuccessMsg, setSupplierSuccessMsg] = useState<string | null>(null);
  const [supplierError, setSupplierError] = useState<string | null>(null);

  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // Form Value states
  const [rfqForm, setRfqForm] = useState<RFQFormState>({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    productRequired: "",
    quantity: "",
    technicalSpecs: "",
    deliveryLocation: "",
    requiredDeliveryDate: "",
    budgetRange: "",
    additionalRequirements: "",
    fileData: null,
    fileName: null,
    fileType: null
  });

  const [supplierForm, setSupplierForm] = useState<SupplierFormState>({
    companyName: "",
    website: "",
    contactInfo: "",
    productCategories: "",
    certifications: "",
    manufacturingCapabilities: "",
    exportMarkets: ""
  });

  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "General Sourcing Inquiry",
    message: ""
  });

  // Reference for file input and drag status
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Image assets fallback states to prevent blank displays in any environment
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [heroLoadError, setHeroLoadError] = useState(false);

  // Load registered records in realtime to demonstrate operational transparency
  const fetchSubmissions = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissionsList(data.submissions || []);
      }
    } catch (e) {
      console.error("Could not fetch submissions from B2B backend API", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // Poll submissions to sync data cleanly in the iframe environment
    const interval = setInterval(fetchSubmissions, 20000);
    return () => clearInterval(interval);
  }, []);

  // Set initial default dates
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 45); // Standard 45-day target lead window
    setRfqForm(prev => ({
      ...prev,
      requiredDeliveryDate: defaultDate.toISOString().substring(0, 10)
    }));
  }, []);

  // Scroll to main container upon tab change to keep UX pristine
  const handleTabChange = (tabName: typeof activeTab) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // RFQ file attachment utility (Base64 conversion)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("Attachment size exceeds 10MB limit. For large industrial drawing sets, please compress the files first.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setRfqForm(prev => ({
        ...prev,
        fileData: reader.result as string,
        fileName: file.name,
        fileType: file.type
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeAttachedFile = () => {
    setRfqForm(prev => ({
      ...prev,
      fileData: null,
      fileName: null,
      fileType: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submission handlers linked directly to the Express backend API
  const handleRfqSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingRfq(true);
    setRfqSuccessMsg(null);
    setRfqError(null);

    if (!rfqForm.companyName || !rfqForm.contactPerson || !rfqForm.email || !rfqForm.productRequired) {
      setRfqError("Missing required fields. Please fill out corporate name, contact person, email, and required product descriptions.");
      setSubmittingRfq(false);
      return;
    }

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rfqForm)
      });

      const resData = await response.json();
      if (response.ok) {
        setRfqSuccessMsg(resData.message || "RFQ Successfully Processed!");
        setRfqForm(prev => ({
          ...prev,
          productRequired: "",
          quantity: "",
          technicalSpecs: "",
          budgetRange: "",
          additionalRequirements: "",
          fileData: null,
          fileName: null,
          fileType: null
        }));
        fetchSubmissions();
      } else {
        setRfqError(resData.error || "An error occurred while submitting your RFQ.");
      }
    } catch (err) {
      setRfqError("A technical communication error occurred. Please verify your connection or try again.");
    } finally {
      setSubmittingRfq(false);
    }
  };

  const handleSupplierSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingSupplier(true);
    setSupplierSuccessMsg(null);
    setSupplierError(null);

    if (!supplierForm.companyName || !supplierForm.contactInfo || !supplierForm.productCategories) {
      setSupplierError("Please complete your Company Name, Primary Contact Info, and Core Supply Categories.");
      setSubmittingSupplier(false);
      return;
    }

    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierForm)
      });

      const resData = await response.json();
      if (response.ok) {
        setSupplierSuccessMsg(resData.message || "Supplier Registration Successfully Transmitted.");
        setSupplierForm({
          companyName: "",
          website: "",
          contactInfo: "",
          productCategories: "",
          certifications: "",
          manufacturingCapabilities: "",
          exportMarkets: ""
        });
        fetchSubmissions();
      } else {
        setSupplierError(resData.error || "An error occurred during submission.");
      }
    } catch (err) {
      setSupplierError("Failed to register supplier profile. Please verify your network availability.");
    } finally {
      setSubmittingSupplier(false);
    }
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    setContactSuccessMsg(null);
    setContactError(null);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError("Required fields missing. Provide your name, contact email, and detailed message body.");
      setSubmittingContact(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });

      const resData = await response.json();
      if (response.ok) {
        setContactSuccessMsg(resData.message || "Your inquiry has been successfully routed.");
        setContactForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          subject: "General Sourcing Inquiry",
          message: ""
        });
        fetchSubmissions();
      } else {
        setContactError(resData.error || "Communication failed.");
      }
    } catch (err) {
      setContactError("Failed to dispatch your request. Please check your data or try again.");
    } finally {
      setSubmittingContact(false);
    }
  };

  // Filter services shown in Services view
  const filteredServices = SERVICES_DATA.filter(srv => {
    const matchesFilter = serviceFilter === "all" || srv.category === serviceFilter;
    const matchesSearch = srv.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          srv.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Pick industry icon dynamically
  const renderIndustryIcon = (name: string) => {
    const iconProps = { className: "w-6 h-6 shrink-0 text-blue-600" };
    switch (name) {
      case "FlameKindling": return <Flame {...iconProps} />;
      case "HardHat": return <HardHat {...iconProps} />;
      case "Wrench": return <Wrench {...iconProps} />;
      case "Cpu": return <Cpu {...iconProps} />;
      case "Zap": return <Zap {...iconProps} />;
      case "Settings": return <Settings {...iconProps} />;
      default: return <Warehouse {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-800 antialiased">
      
      {/* 1. PROFESSIONAL CORPORATE HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" id="corporate-navigation-bar">
        {/* Top Ticker with Office and Status */}
        <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs font-medium tracking-wide flex justify-between items-center overflow-x-auto">
          <div className="flex items-center space-x-4 shrink-0">
            <span className="flex items-center text-slate-100 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Procurement Solutions Network
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Jersey City, NJ, USA
            </span>
          </div>
          <div className="flex items-center space-x-4 text-right">
            <span>Corporate Sourcing Active</span>
            <span className="text-slate-600">|</span>
            <button 
              onClick={() => handleTabChange("rfq")} 
              className="text-white hover:text-blue-400 transition-colors bg-blue-700/60 px-2.5 py-0.5 rounded text-[11px]"
            >
              Access RFQ Portal
            </button>
          </div>
        </div>

        {/* Brand Header Navigation Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo element with graceful fallback */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabChange("home")}>
            {!logoLoadError ? (
              <img 
                src="/src/assets/images/exoboll_logo_1781141248222.png" 
                alt="Exoboll Logo" 
                className="h-9 w-auto object-contain bg-slate-950 p-1 border border-slate-200 rounded"
                onError={() => setLogoLoadError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded bg-blue-900 border border-blue-700 flex items-center justify-center font-bold text-white text-md tracking-wider">
                E
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-slate-900 font-display font-extrabold text-lg tracking-tight uppercase leading-none">
                Exoboll
              </span>
              <span className="text-slate-500 font-sans text-[10px] uppercase tracking-widest font-bold mt-1 leading-none">
                Procurement Solutions
              </span>
            </div>
          </div>

          {/* New Clean Corporate Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Corporate Navigation">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "services", label: "Services" },
              { id: "industries", label: "Industries Served" },
              { id: "supplier-network", label: "Supplier Network" },
              { id: "rfq", label: "Request for Quote (RFQ)" },
              { id: "contact", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? "bg-slate-100 text-blue-700 border-b-2 border-blue-600" 
                    : "text-slate-650 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick Submissions Tracking & Submission triggers */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleTabChange("rfq")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm hover:shadow transition-all flex items-center"
            >
              <FileCheck className="w-4 h-4 mr-1.5" /> Submit RFQ
            </button>
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded flex items-center transition-all"
              title="View Submission Ledgers"
            >
              <Database className="w-3.5 h-3.5 mr-1 text-slate-500" /> 
              <span>Registry Log</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu view */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-4 space-y-1.5 animate-fadeIn">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "services", label: "Services" },
              { id: "industries", label: "Industries Served" },
              { id: "supplier-network", label: "Supplier Network" },
              { id: "rfq", label: "Request for Quote (RFQ)" },
              { id: "contact", label: "Contact" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`w-full text-left block px-3 py-2 rounded text-base font-semibold ${
                  activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTabChange("rfq")}
                className="bg-blue-600 text-white text-center text-xs font-bold py-2.5 rounded shadow-sm"
              >
                Submit RFQ
              </button>
              <button
                onClick={() => { setShowAdminPanel(true); setMobileMenuOpen(false); }}
                className="bg-slate-200 text-slate-800 text-center text-xs font-semibold py-2.5 rounded"
              >
                View Registry Log
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SUBMISSION REGISTRY PANEL (Clean Corporate Oversight Drawer) */}
      {showAdminPanel && (
        <div className="bg-slate-100 border-b border-slate-200 py-5 px-4 sm:px-6 lg:px-8 shadow-inner animate-slideDown">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-800" />
                <h4 className="text-sm font-semibold text-slate-800 font-display uppercase tracking-wider">
                  Operational Sourcing Registry (Jersey City HQ Gateway Log)
                </h4>
              </div>
              <button 
                onClick={() => setShowAdminPanel(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center space-x-1"
              >
                <X className="w-4 h-4" /> <span>Close Log</span>
              </button>
            </div>
            
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This log lists real-time B2B RFQs, supplier profile registrations, and general inquiries processed by the Exoboll corporate back-office network databases. All submissions are automatically indexed on our secure server.
            </p>

            {loadingLogs ? (
              <div className="flex items-center justify-center p-6 text-slate-600 text-xs font-mono">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" /> Synchronizing secure registry ledgers...
              </div>
            ) : submissionsList.length === 0 ? (
              <p className="text-xs italic text-slate-500 bg-white p-4 rounded border border-slate-200 text-center">
                No active filings found in server memory. Submissions you file in our RFQ, Supplier, or Contact tabs will appear below instantly.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-72 overflow-y-auto pr-2">
                {submissionsList.map((sub) => (
                  <div key={sub.id} className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex flex-col justify-between text-xs hover:border-blue-400 transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.type === "rfq" 
                            ? "bg-blue-100 text-blue-800" 
                            : sub.type === "supplier" 
                              ? "bg-slate-100 text-slate-800" 
                              : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {sub.type.toUpperCase()} Filed
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(sub.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="font-bold text-slate-800 text-xs truncate">
                        {sub.data.companyName || sub.data.company || sub.data.name || "Corporate Partner"}
                      </p>
                      
                      <div className="text-slate-600 mt-1 space-y-1 font-mono text-[11px] leading-snug">
                        {sub.type === "rfq" && (
                          <>
                            <div className="text-slate-800"><span className="text-slate-400">Spec:</span> {sub.data.productRequired}</div>
                            <div><span className="text-slate-400">Qty:</span> {sub.data.quantity || "Not Specified"}</div>
                            <div><span className="text-slate-400">Target Dest:</span> {sub.data.deliveryLocation || "US Destination"}</div>
                          </>
                        )}
                        {sub.type === "supplier" && (
                          <>
                            <div><span className="text-slate-400">Caps:</span> {sub.data.manufacturingCapabilities || "Verified Mill"}</div>
                            <div><span className="text-slate-400">Categories:</span> {sub.data.productCategories}</div>
                          </>
                        )}
                        {sub.type === "contact" && (
                          <>
                            <div><span className="text-slate-400">Subject:</span> {sub.data.subject}</div>
                            <div className="truncate"><span className="text-slate-400">Msg:</span> {sub.data.message}</div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Ref ID: <strong className="text-slate-600 font-mono">{sub.id}</strong></span>
                      <span className="flex items-center text-emerald-600 font-medium">
                        <Check className="w-3.5 h-3.5 mr-0.5" /> Emailed to jmeza@exoboll.com
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. DYNAMIC PAGE CONTENT ROTATOR */}
      <main className="flex-grow">
        
        {/* ================= HOME VIEW ================= */}
        {activeTab === "home" && (
          <div className="animate-fadeIn">
            
            {/* 1. HERO BLOCK */}
            <div className="relative bg-slate-900 overflow-hidden py-24 sm:py-32">
              {/* Modern Corporate Visual Background overlay */}
              <div className="absolute inset-0 z-0">
                {!heroLoadError ? (
                  <img 
                    src="/src/assets/images/hero_background_1781141261085.png" 
                    alt="Exoboll Supply Chain Logistics" 
                    className="w-full h-full object-cover brightness-[0.22] contrast-[0.9]"
                    onError={() => setHeroLoadError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900"></div>
                )}
                {/* Clean soft gradient matching corporate look */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-905/70 to-transparent"></div>
              </div>

              {/* Hero content */}
              <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/80 text-blue-200 mb-6 border border-blue-700/50 uppercase tracking-widest font-mono">
                  B2B Sourcing & Supply Chain Integrity
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white mb-6 leading-tight">
                  Premium Procurement & <br className="hidden sm:inline" />
                  <span className="text-blue-400 font-display font-black">Strategic Global Sourcing</span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg mb-10 leading-relaxed font-light">
                  A trusted North American procurement partner securing certified metals, construction materials, heavy machinery, and high-tolerance industrial equipment for major operations. 
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => handleTabChange("rfq")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded shadow-lg text-sm uppercase tracking-wider transition-all flex items-center justify-center border border-blue-500/10"
                  >
                    Submit Industrial RFQ <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button
                    onClick={() => handleTabChange("services")}
                    className="bg-slate-800/80 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold px-8 py-4 rounded text-sm uppercase tracking-wider transition-all"
                  >
                    Explore Our Services
                  </button>
                </div>

                {/* Light Minimal corporate stats dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800 max-w-4xl mx-auto text-slate-300 text-left">
                  <div>
                    <div className="text-2xl font-black text-white font-display">Jersey City, NJ</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">U.S. Corporate HQ</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-display">500+ Verified Mills</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Global Manufacturer Base</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-display">12 Critical Sectors</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Multi-Industry Coverage</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-display">100% Verified</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Mill Test Certifications</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CORE SERVICES OVERVIEW */}
            <div className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">B2B Core Competences</span>
                <h2 className="text-3xl font-display font-extrabold text-slate-900 mt-2 mb-4">Strategic Sourcing Capabilities</h2>
                <p className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base mb-12">
                  Exoboll optimizes supply chain performance by aligning purchase requirements with verified manufacturers and rigorous auditing pipelines.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                  
                  {/* Sourcing Item 1 */}
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center mb-6">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-3">Strategic Sourcing</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Deploying global intelligence and market indexes to decrease Total Cost of Ownership (TCO) on critical raw metallic elements and specialized composites.
                    </p>
                    <ul className="text-xs space-y-2 mt-4 text-slate-700">
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Cost Scenario Modeling</li>
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Multi-Mill Contract Allocations</li>
                    </ul>
                  </div>

                  {/* Sourcing Item 2 */}
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center mb-6">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-3">Vendor Qualification</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Executing strict physical audits for solvency, quality assurance protocols, ASTM compliance, and capacity verification prior to allocation.
                    </p>
                    <ul className="text-xs space-y-2 mt-4 text-slate-700">
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Material Traceability Checks</li>
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Quality Management System Auditting</li>
                    </ul>
                  </div>

                  {/* Sourcing Item 3 */}
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center mb-6">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-3">Integrated Logistics</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Managing complex customs procedures, multimodal land freight schedules, port handling protocols, and synchronized jobsite arrivals.
                    </p>
                    <ul className="text-xs space-y-2 mt-4 text-slate-700">
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Port-to-Jobsite Heavy Transport</li>
                      <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-blue-600" /> Dedicated Customs Clearance Management</li>
                    </ul>
                  </div>

                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => handleTabChange("services")}
                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-all"
                  >
                    <span>View our comprehensive service catalog</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. INDUSTRIES SERVED (Grid layout as requested instead of large text blocks) */}
            <div className="py-20 bg-slate-50 border-t border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Scope of Deliveries</span>
                  <h2 className="text-3xl font-display font-extrabold text-slate-900 mt-2 mb-4">Key Sourcing Industries Served</h2>
                  <p className="text-slate-600 text-sm">
                    Exoboll manages contract supplies for structural steel fabricators, high-rise developers, utility cooperatives, and mass manufacturing firms.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {INDUSTRIES_DATA.slice(0, 4).map((ind) => (
                    <div key={ind.id} className="bg-white p-6 rounded-lg border border-slate-250 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all">
                      <div>
                        <div className="mb-4">{renderIndustryIcon(ind.iconName)}</div>
                        <h3 className="text-base font-bold text-slate-930 mb-2 font-display">{ind.title}</h3>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
                          {ind.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                        {ind.keyMaterials.slice(0, 2).map((mat, mIdx) => (
                          <span key={mIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Dynamic promo tile to complete grid layout */}
                  <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-lg flex flex-col justify-between shadow-md">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-blue-300">Explore Sourcing Specialties</span>
                      <h3 className="text-lg font-bold font-display mt-2">Additional Major Sectors Available</h3>
                      <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                        We also coordinate raw components for infrastructure bypasses, civil construction, utility cooperatives, and commercial retrofitting.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTabChange("industries")}
                      className="mt-6 text-xs text-white hover:text-blue-300 font-bold flex items-center space-x-1 uppercase"
                    >
                      <span>Show All 7 Industries</span> <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PROCUREMENT PROCESS TIMELINE */}
            <div className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Fulfillment Workflow</span>
                  <h2 className="text-3xl font-display font-extrabold text-slate-900 mt-2 mb-4">Structured Sourcing Operations</h2>
                  <p className="text-slate-600 text-sm">
                    How Exoboll moves requirements from initial material specifications to final secure jobsite arrival.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  
                  <div className="relative p-5">
                    <div className="absolute top-0 left-5 text-4xl font-extrabold text-slate-200 mt-1">01</div>
                    <div className="relative pl-8 pt-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">Specification Review</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Our industrial mechanical consultants translate your drawings and ASTM requirements to ensure zero error margins at raw mills.
                      </p>
                    </div>
                  </div>

                  <div className="relative p-5">
                    <div className="absolute top-0 left-5 text-4xl font-extrabold text-slate-200 mt-1">02</div>
                    <div className="relative pl-8 pt-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">Supplier Mapping</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        We map requirements against verified domestic and international tier-1 mills, validating current capacities and raw allocations.
                      </p>
                    </div>
                  </div>

                  <div className="relative p-5">
                    <div className="absolute top-0 left-5 text-4xl font-extrabold text-slate-200 mt-1">03</div>
                    <div className="relative pl-8 pt-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">Direct Allocations</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        We negotiate core rolling slots directly, establishing fixed commercial contracts to protect against material fluctuation risks.
                      </p>
                    </div>
                  </div>

                  <div className="relative p-5">
                    <div className="absolute top-0 left-5 text-4xl font-extrabold text-slate-200 mt-1">04</div>
                    <div className="relative pl-8 pt-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">Logistics & Delivery</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        We coordinate ocean booking, customs bonds preparation, and final flatbed dispatch straight to clean site drop-points.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 5. WHY CHOOSE US (Highlighting Credibility and Trust) */}
            <div className="py-20 bg-slate-50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-5 space-y-5">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Commercial Standards</span>
                    <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-snug">
                      Uncompromising B2B Operations Compliance
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Securing materials is not merely about finding products. It requires exact traceability, verified chemical test sheets, and structural risk insulation. 
                    </p>
                    
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start">
                        <div className="h-6 w-6 mt-1 text-emerald-600 mr-3 shrink-0">
                          <ShieldCheck />
                        </div>
                        <div>
                          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Mill Test Certifications provided</h4>
                          <p className="text-slate-600 text-xs mt-0.5">Every structural Steel delivery includes certified MTRs directly matching production heats.</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="h-6 w-6 mt-1 text-emerald-600 mr-3 shrink-0">
                          <CheckCircle2 />
                        </div>
                        <div>
                          <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Zero Compromise Audit Cycles</h4>
                          <p className="text-slate-600 text-xs mt-0.5">Our suppliers undergo physical capacity, working capital, and ISO certification analysis annually.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="font-display font-extrabold text-xl text-blue-700 mb-2">120k+ Tons</h3>
                      <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">Materials Secured</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Successfully managed steel delivery, raw castings, fitting anchors, and customized tooling loads.
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="font-display font-extrabold text-xl text-blue-700 mb-2">500+ Nodes</h3>
                      <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">Supplier Network</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Pre-screened primary rolling mills, wood suppliers, and industrial OEMs across North America, Europe, and Asia.
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="font-display font-extrabold text-xl text-blue-700 mb-2">100% Traceable</h3>
                      <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">Material Sourcing</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Full compliance with federal and state procurement guidelines, including Buy America parameters when mandated.
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="font-display font-extrabold text-xl text-blue-700 mb-2">25+ Years</h3>
                      <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">Combined Sourcing Slices</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Executive advisors with comprehensive backgrounds in global maritime, metallurgical, and structural pricing.
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* 6. CONCISE CONTACT CTA SECTION */}
            <div className="bg-slate-900 py-16 text-white border-t border-slate-800">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Ready to optimize your next procurement billing?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Connect directly with our Jersey City headquarters sourcing desk. Submit an RFQ to secure certified steel, structural timber, or high-tolerance industrial assemblies.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => handleTabChange("rfq")}
                    className="bg-blue-600 hover:bg-blue-750 text-white font-bold py-3.5 px-8 rounded text-xs uppercase tracking-wider font-mono"
                  >
                    Launch Quote Form (RFQ)
                  </button>
                  <button
                    onClick={() => handleTabChange("contact")}
                    className="bg-transparent hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded border border-slate-700 text-xs uppercase tracking-wider font-mono"
                  >
                    Contact Jersey City Office
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= ABOUT US VIEW ================= */}
        {activeTab === "about" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Administrative Integrity</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Exoboll Corporate Profile
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Based strategically in Jersey City, New Jersey, Exoboll Procurement Solutions functions as an executive-level material sourcing group.
                </p>
              </div>

              <div className="space-y-12">
                
                {/* 1. Deep Core Story */}
                <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm leading-relaxed">
                  <p>
                    For over two decades, Exoboll team members have structured multi-tiered procurement pipelines for high-rise developers, state-level infrastructure bypasses, heavy machinery operators, and major manufacturing plants. We isolate projects against the risks of raw material inflation, rolling mill delays, and capacity failures.
                  </p>
                  
                  <blockquote className="bg-slate-50 border-l-4 border-blue-600 p-5 rounded-r italic text-slate-800 font-medium">
                    "Our company is structured on the fundamentals of specification compliance, absolute contractual transparency, and direct mill relationships. We exist to ensure that qualified manufacturing lines and structural builders are insulated from supply vulnerabilities."
                  </blockquote>

                  <p>
                    Exoboll manages end-to-end commercial operations. From translating complex mechanical technical specification sheets into precise manufacturing metrics, to securing primary mill booking allocations, handling custom clearances, and scheduling flatbed site logistics - our focus remains centered on execution.
                  </p>
                </div>

                {/* 2. Mission and Vision boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-200">
                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                    <div className="text-xs text-blue-600 uppercase font-bold font-mono tracking-widest mb-3">Our Mission</div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-3">Material Supply Security</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      To deliver high-impact procurement solutions by bridging major contractors and manufacturers with pre-qualified industrial mills, ensuring raw goods conform perfectly to specified engineering guidelines.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                    <div className="text-xs text-blue-600 uppercase font-bold font-mono tracking-widest mb-3">Our Vision</div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-3">America's Primary Sourcing Hub</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      To lead as North America's most trusted executive procurement proxy, universally recognized by operations directors and suppliers alike for professional verification, prompt service, and complete commercial traceability.
                    </p>
                  </div>
                </div>

                {/* 3. Physical HQ Detail */}
                <div className="bg-blue-50/50 p-8 rounded-lg border border-blue-105 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="space-y-2 mb-6 md:mb-0">
                    <h4 className="text-slate-900 font-display font-extrabold text-md md:text-lg">Jersey City Corporate Office</h4>
                    <p className="text-slate-600 text-xs max-w-md">
                      Exoboll operates its principal management from New Jersey, utilizing immediate regional proximity to leading Atlantic shipping ports, customs brokers, and domestic highway transport pathways.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("contact")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold px-5 py-3 rounded tracking-wider uppercase whitespace-nowrap transition-all"
                  >
                    Consult Sourcing Desk
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= SERVICES VIEW ================= */}
        {activeTab === "services" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Service Range</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Procurement Services Catalog
                </h1>
                <p className="text-slate-600 text-sm">
                  Filter through our 12 certified commercial supply procedures. Use the instant search bar to find dynamic materials allocations or specific technical features.
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                
                {/* Search input */}
                <div className="relative w-full md:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search capabilities or requirements..."
                    className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter pill tabs */}
                <div className="flex flex-wrap gap-1.5 overflow-x-auto py-1">
                  {[
                    { label: "All Services", value: "all" },
                    { label: "Strategic Sourcing", value: "sourcing" },
                    { label: "Procurement Management", value: "procurement" },
                    { label: "Logistics", value: "logistics" },
                    { label: "Supply Chain Consulting", value: "consulting" }
                  ].map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setServiceFilter(btn.value)}
                      className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                        serviceFilter === btn.value 
                          ? "bg-blue-650 text-white shadow-sm" 
                          : "bg-white text-slate-650 border border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((srv) => (
                    <div key={srv.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-mono">
                          {srv.category}
                        </span>
                        <h3 className="text-md sm:text-lg font-extrabold text-slate-900 font-display mt-4 mb-2">
                          {srv.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                          {srv.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 mt-auto">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                          Key Sourcing Deliverables:
                        </div>
                        <ul className="space-y-1.5">
                          {srv.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center text-xs text-slate-705">
                              <Check className="w-3.5 h-3.5 mr-2 text-blue-600 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-slate-50 border border-slate-200 rounded">
                    <BadgeAlert className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-mono text-xs">No procurement solutions match your query parameters.</p>
                    <button 
                      onClick={() => { setServiceFilter("all"); setSearchQuery(""); }}
                      className="mt-2 text-xs text-blue-600 underline hover:text-blue-800 font-bold"
                    >
                      Reset filtering states
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= INDUSTRIES SERVED VIEW ================= */}
        {activeTab === "industries" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Operation Areas</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Sourced Industries Served
                </h1>
                <p className="text-slate-600 text-sm">
                  We formulate customized direct procurement procedures and quality verification checks optimized for 7 major commercial segments.
                </p>
              </div>

              {/* Clean corporate card grid matching the user instruction */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {INDUSTRIES_DATA.map((ind) => (
                  <div key={ind.id} className="bg-slate-50 border border-slate-200 p-6 rounded-lg flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      {/* Top icon and segment identity */}
                      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-200">
                        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-md">
                          {renderIndustryIcon(ind.iconName)}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-display font-bold text-base text-slate-900">{ind.title}</h3>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Compliance Traced</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-6">
                        {ind.description}
                      </p>

                      {/* Standards requirements checklist */}
                      <div className="space-y-2 mb-6">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Operation Accreditations:</div>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {ind.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start">
                              <span className="text-blue-600 mr-2 shrink-0 font-bold">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Materials tags */}
                    <div className="pt-4 border-t border-slate-200/80">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Typical allocations filed:</div>
                      <div className="flex flex-wrap gap-1">
                        {ind.keyMaterials.map((mat, mIdx) => (
                          <span key={mIdx} className="text-[10px] bg-white border border-slate-205 text-slate-650 px-2.5 py-1 rounded font-mono font-medium">
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Quote Banner */}
              <div className="bg-slate-900 text-white rounded-lg p-6 sm:p-10 mt-12 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-900 to-blue-950">
                <div className="space-y-2 pb-6 md:pb-0 text-center md:text-left">
                  <h4 className="text-lg font-bold font-display text-white">Require specialized alloy shapes or unusual dimensions?</h4>
                  <p className="text-slate-305 text-xs">Exoboll routes custom specifications directly to premier certified rollers internationally.</p>
                </div>
                <button
                  onClick={() => handleTabChange("rfq")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold py-3.5 px-6 rounded uppercase tracking-wider transition-all whitespace-nowrap shadow-md"
                >
                  Submit Special Spec RFQ <ArrowUpRight className="inline w-4.5 h-4.5 ml-1" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= SUPPLIER NETWORK VIEW ================= */}
        {activeTab === "supplier-network" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Mill Registration</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Global Supplier Network Onboarding
                </h1>
                <p className="text-slate-600 text-sm">
                  Exoboll holds high qualifications standards. Manufacturing establishments, certified metal rolling plants, and timber mills can register for review.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Qualification Guidelines card */}
                <div className="lg:col-span-5 bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                  <h3 className="font-display font-bold text-slate-900 border-b border-slate-200 pb-3">
                    Verification Standard Requirements
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prior to joining active Exoboll buyer portfolios, potential vendors must supply detailed verification checklists demonstrating:
                  </p>

                  <ul className="space-y-4 text-xs font-medium text-slate-700">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-605 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <strong>ISO 9001 Alignment:</strong>
                        <p className="font-normal text-[11px] text-slate-550 mt-0.5">Manufacturing plants must employ traceable quality administration.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-605 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <strong>Metallurgical Traceability:</strong>
                        <p className="font-normal text-[11px] text-slate-550 mt-0.5">Capacity to produce chemical mill testing logs matching individual heats.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-605 mr-2 shrink-0 mt-0.5" />
                      <div>
                        <strong>Financial Standing Auditing:</strong>
                        <p className="font-normal text-[11px] text-slate-550 mt-0.5">Must withstand basic commercial background reviews for complete insolvency safety.</p>
                      </div>
                    </li>
                  </ul>

                  <div className="p-3 bg-blue-50 border border-blue-105 rounded text-[11px] text-slate-600 italic">
                    All successful filings are stored in server memory and instantly accessible to Exoboll operations estimators at Jersey City headquarters.
                  </div>
                </div>

                {/* Registration Form Column */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-md sm:text-lg font-bold font-display text-slate-800 pb-2 border-b border-slate-100">
                    Strategic Network Registration Form
                  </h3>

                  {supplierSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded text-xs space-y-1">
                      <p className="font-bold">Transmission Complete:</p>
                      <p>{supplierSuccessMsg}</p>
                    </div>
                  )}

                  {supplierError && (
                    <div className="p-4 bg-rose-50 border border-rose-250 text-rose-850 rounded text-xs">
                      {supplierError}
                    </div>
                  )}

                  <form onSubmit={handleSupplierSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={supplierForm.companyName}
                          onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                          placeholder="International Metals Inc."
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Website URL</label>
                        <input
                          type="url"
                          value={supplierForm.website}
                          onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })}
                          placeholder="https://www.company.com"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Primary Contact Info *</label>
                      <input
                        type="text"
                        required
                        value={supplierForm.contactInfo}
                        onChange={(e) => setSupplierForm({ ...supplierForm, contactInfo: e.target.value })}
                        placeholder="John Miller (contracts@domain.com, +1 (201) 685-0542)"
                        className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Core Supply Categories *</label>
                      <input
                        type="text"
                        required
                        value={supplierForm.productCategories}
                        onChange={(e) => setSupplierForm({ ...supplierForm, productCategories: e.target.value })}
                        placeholder="ASTM H-beams, Hot Rolled steel, custom carbon profiles"
                        className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Current QA Certifications</label>
                      <input
                        type="text"
                        value={supplierForm.certifications}
                        onChange={(e) => setSupplierForm({ ...supplierForm, certifications: e.target.value })}
                        placeholder="ISO 9001:2015, ASME Sec VIII Division 1"
                        className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">On-site Production Capabilities</label>
                      <textarea
                        rows={3}
                        value={supplierForm.manufacturingCapabilities}
                        onChange={(e) => setSupplierForm({ ...supplierForm, manufacturingCapabilities: e.target.value })}
                        placeholder="Hot rolling to 35-inch widths, precision plate cutting..."
                        className="w-full bg-slate-50 border border-slate-350 rounded p-3 focus:border-blue-550 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase tracking-wider">Export Shipping Markets</label>
                      <input
                        type="text"
                        value={supplierForm.exportMarkets}
                        onChange={(e) => setSupplierForm({ ...supplierForm, exportMarkets: e.target.value })}
                        placeholder="North America, Western Europe, Brazil"
                        className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingSupplier}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold p-3.5 rounded transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer"
                    >
                      {submittingSupplier ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing Vendor Registration...
                        </>
                      ) : (
                        "Submit Supplier Registration Profile"
                      )}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= REQUEST FOR QUOTE (RFQ) VIEW ================= */}
        {activeTab === "rfq" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Commercial Filing</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Request for Quote Gateway (RFQ)
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                  Submit critical material dimensions, quality standards (ASTM / AISC), required quantities, and target deliveries below. The Exoboll office will route parameters directly to premium certified manufacturer slots.
                </p>
              </div>

              {/* Secure warning notice for corporate trust */}
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-205 mb-10 flex items-start space-x-3 text-xs text-slate-650 leading-relaxed">
                <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Protected Sourcing Specifications:</strong>
                  <p className="mt-1">
                    Your drawings, company identities, and pricing profiles are protected against third-party disclosure. All technical documents or specs submitted below are routed to our secure administrative headquarters (Jersey City, NJ) at <strong className="text-slate-900 font-mono">jmeza@exoboll.com</strong>.
                  </p>
                </div>
              </div>

              {/* Form container */}
              <div className="bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6">
                
                {rfqSuccessMsg && (
                  <div className="p-5 bg-emerald-50 border border-emerald-250 text-emerald-850 rounded text-xs space-y-2">
                    <p className="font-bold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
                      RFQ Received & Routed Securely
                    </p>
                    <p>{rfqSuccessMsg}</p>
                    <p className="text-[11px] text-slate-550 leading-relaxed pt-1.5 border-t border-emerald-150-f">
                      Our commercial estimates department is already compiling market parameters and direct-mill allocations. Expect a compliant commercial offer in your inbox shortly.
                    </p>
                  </div>
                )}

                {rfqError && (
                  <div className="p-4 bg-rose-50 border border-rose-250 text-rose-850 rounded text-xs font-semibold">
                    {rfqError}
                  </div>
                )}

                <form onSubmit={handleRfqSubmit} className="space-y-6 text-xs">
                  
                  {/* Step 1: Corporate contact */}
                  <div className="space-y-4">
                    <h3 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2 uppercase tracking-wide">
                      1. Corporate Identity & Sourcing Representative
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={rfqForm.companyName}
                          onChange={(e) => setRfqForm({ ...rfqForm, companyName: e.target.value })}
                          placeholder="Steel Fabricators Corp."
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Contact Representative *</label>
                        <input
                          type="text"
                          required
                          value={rfqForm.contactPerson}
                          onChange={(e) => setRfqForm({ ...rfqForm, contactPerson: e.target.value })}
                          placeholder="David Vance (Procurement Manager)"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Professional Email *</label>
                        <input
                          type="email"
                          required
                          value={rfqForm.email}
                          onChange={(e) => setRfqForm({ ...rfqForm, email: e.target.value })}
                          placeholder="d.vance@steelfabricators.com"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Direct Office Phone</label>
                        <input
                          type="text"
                          value={rfqForm.phone}
                          onChange={(e) => setRfqForm({ ...rfqForm, phone: e.target.value })}
                          placeholder="+1 (201) 685-0542"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Product parameters */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2 uppercase tracking-wide">
                      2. Sourcing Parameters & Technical Specifications
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Product or Materials Required *</label>
                        <input
                          type="text"
                          required
                          value={rfqForm.productRequired}
                          onChange={(e) => setRfqForm({ ...rfqForm, productRequired: e.target.value })}
                          placeholder="ASTM A572 Grade 50 Heavy I-Beams"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Quantity and Units *</label>
                        <input
                          type="text"
                          required
                          value={rfqForm.quantity}
                          onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                          placeholder="450 Metric Tons or custom rolling"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase">Detailed Technical Specifications</label>
                      <textarea
                        rows={4}
                        value={rfqForm.technicalSpecs}
                        onChange={(e) => setRfqForm({ ...rfqForm, technicalSpecs: e.target.value })}
                        placeholder="Please key in exact dimensions, chemical composition requirements, tolerance criteria, or specific testing models (e.g. Charpy V-Notcher testing)..."
                        className="w-full bg-slate-50 border border-slate-350 rounded p-3 focus:border-blue-550 focus:outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Step 3: Timelines and delivery */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2 uppercase tracking-wide">
                      3. Logistics & Sourcing Capital Ranges
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Delivery Destination *</label>
                        <input
                          type="text"
                          required
                          value={rfqForm.deliveryLocation}
                          onChange={(e) => setRfqForm({ ...rfqForm, deliveryLocation: e.target.value })}
                          placeholder="Port of Houston Terminal, TX"
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Target Delivery Window *</label>
                        <input
                          type="date"
                          required
                          value={rfqForm.requiredDeliveryDate}
                          onChange={(e) => setRfqForm({ ...rfqForm, requiredDeliveryDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2 focus:border-blue-550 focus:outline-none text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Target Capital Program</label>
                        <select
                          value={rfqForm.budgetRange}
                          onChange={(e) => setRfqForm({ ...rfqForm, budgetRange: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none text-slate-800 text-xs"
                        >
                          <option value="">Select Range</option>
                          <option value="Under $50,000">Under $50,000</option>
                          <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                          <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                          <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                          <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                          <option value="Over $1,000,000">Over $1,000,000</option>
                        </select>
                      </div>
                    </div>

                    {/* Drag-and-drop Technical Files Attachment */}
                    <div>
                      <label className="block text-slate-650 font-bold mb-2 uppercase">Attach Technical Drawings & Blueprints</label>
                      
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                          dragOver 
                            ? "border-blue-550 bg-blue-50/50" 
                            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.dwg,.csv,.xlsx,.xls,.docx,.doc,image/*"
                        />
                        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <p className="font-bold text-slate-700 text-xs">
                          Drag and drop your engineering drawings here or <span className="text-blue-600 underline">browse computer code</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Supports PDF, DWG, CAD files, CSV sheets, and Word docs up to 10MB.
                        </p>
                      </div>

                      {rfqForm.fileName && (
                        <div className="mt-3 p-3 bg-slate-100 rounded border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                            <span className="text-slate-800 font-medium truncate max-w-sm">{rfqForm.fileName}</span>
                            <span className="text-[10px] text-slate-400">Attached successfully</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeAttachedFile}
                            className="text-rose-600 hover:text-rose-800 font-bold font-mono text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={submittingRfq}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold py-3.5 rounded transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer shadow-md"
                  >
                    {submittingRfq ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Routing RFQ Payload directly to Jersey City HQ...
                      </>
                    ) : (
                      "Submit Protected RFQ Specs"
                    )}
                  </button>
                </form>

              </div>

            </div>
          </div>
        )}

        {/* ================= CONTACT VIEW ================= */}
        {activeTab === "contact" && (
          <div className="animate-fadeIn py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Operations Address</span>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2 mb-4">
                  Contact Sourcing Desk
                </h1>
                <p className="text-slate-600 text-sm">
                  Whether you require long-term price index planning, structural timber audits, or emergency pipeline materials, Exoboll is equipped to respond.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Physical Location Details Frame */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                    <h3 className="font-display font-black text-slate-900 uppercase tracking-wider text-sm border-b border-slate-205 pb-3">
                      Corporate Headquarters
                    </h3>

                    <div className="space-y-4 text-xs sm:text-sm">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 font-bold font-display uppercase tracking-wider block text-xs">Atlantic Regional Office</strong>
                          <span className="text-slate-650 block leading-relaxed mt-1">
                            Exoboll Procurement Solutions<br />
                            70 Hudson Boulevard, Suite 440<br />
                            Jersey City, NJ 07302
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 font-bold font-display uppercase tracking-wider block text-xs">Direct Executive Sourcing</strong>
                          <a href="mailto:jmeza@exoboll.com" className="text-blue-600 hover:underline font-mono text-xs mt-1 block">
                            jmeza@exoboll.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 font-bold font-display uppercase tracking-wider block text-xs">Administrative Telephone</strong>
                          <span className="text-slate-650 font-mono text-xs mt-1 block">+1 (201) 685-0542</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sourcing Hour blocks */}
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h3 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      Sourcing Desk Core Hours
                    </h3>
                    <ul className="text-xs space-y-2 text-slate-600 font-mono">
                      <li className="flex justify-between"><span>Monday - Friday:</span> <strong className="text-slate-800">08:00 AM – 06:00 PM EST</strong></li>
                      <li className="flex justify-between"><span>Saturday:</span> <strong className="text-slate-800">09:00 AM – 02:00 PM EST</strong></li>
                      <li className="flex justify-between"><span>Sunday:</span> <strong className="text-slate-500">Administrative Closure</strong></li>
                    </ul>
                  </div>
                </div>

                {/* Sourcing Contact Request Form */}
                <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-10 rounded-lg border border-slate-200">
                  <h3 className="font-display font-bold text-slate-900 text-md sm:text-lg mb-6 pb-2 border-b border-slate-200">
                    Sourcing Inquiries Formulation
                  </h3>

                  {contactSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded text-xs space-y-1 mb-6">
                      <p className="font-bold">Message Transmitted:</p>
                      <p>{contactSuccessMsg}</p>
                    </div>
                  )}

                  {contactError && (
                    <div className="p-4 bg-rose-50 border border-rose-250 text-rose-850 rounded text-xs mb-6">
                      {contactError}
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Representative Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Elizabeth Smith"
                          className="w-full bg-white border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Associated Company</label>
                        <input
                          type="text"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          placeholder="Commercial Contracting LLC"
                          className="w-full bg-white border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Professional Email *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="e.smith@company.com"
                          className="w-full bg-white border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-650 font-bold mb-1.5 uppercase">Telephone Number</label>
                        <input
                          type="text"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+1 (201) 685-0542"
                          className="w-full bg-white border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase">Core Subject Area</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Urgent direct-mill structural rebar logistics quote"
                        className="w-full bg-white border border-slate-350 rounded p-2.5 focus:border-blue-550 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-650 font-bold mb-1.5 uppercase">Detailed Sourcing Message *</label>
                      <textarea
                        rows={5}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Please key in details regarding delivery locations, timing constraints, required material test logs, or specific ASTM compliance profiles..."
                        className="w-full bg-white border border-slate-350 rounded p-3 focus:border-blue-550 focus:outline-none placeholder:text-slate-405"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingContact}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold p-3.5 rounded transition-all uppercase tracking-wider flex items-center justify-center cursor-pointer shadow-md"
                    >
                      {submittingContact ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Transmitting dispatch query...
                        </>
                      ) : (
                        "Dispatch Inquiry Packet"
                      )}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* 3. PROFESSIONAL CORPORATE FOOTER */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-blue-900 border border-blue-700 flex items-center justify-center font-bold text-white text-xs">
                EX
              </div>
              <span className="text-white font-display font-extrabold text-md tracking-wider">EXOBOLL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Premium B2B procurement advisors. Connecting material needs of prime defense contractors, fabricators, and commercial constructors since 2011.
            </p>
            <div className="text-[10px] text-slate-500 font-mono pt-2">
              © 2026 Exoboll Solutions. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-4">Operations Specialties</h4>
            <ul className="text-xs space-y-2 text-slate-400 font-light">
              <li><button onClick={() => { handleTabChange("services"); setServiceFilter("sourcing"); }} className="hover:text-white">Strategic Sourcing</button></li>
              <li><button onClick={() => { handleTabChange("services"); setServiceFilter("procurement"); }} className="hover:text-white">Procurement Management</button></li>
              <li><button onClick={() => { handleTabChange("services"); setServiceFilter("all"); }} className="hover:text-white">Supplier Identification</button></li>
              <li><button onClick={() => { handleTabChange("services"); setServiceFilter("logistics"); }} className="hover:text-white">Import & Export Support</button></li>
              <li><button onClick={() => { handleTabChange("services"); setServiceFilter("consulting"); }} className="hover:text-white">Supply Chain Resiliency</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-4">Core Sourced Industries</h4>
            <ul className="text-xs space-y-2 text-slate-400 font-light">
              <li><button onClick={() => handleTabChange("industries")} className="hover:text-white">Steel & Metals</button></li>
              <li><button onClick={() => handleTabChange("industries")} className="hover:text-white">Construction Materials</button></li>
              <li><button onClick={() => handleTabChange("industries")} className="hover:text-white">Industrial Equipment</button></li>
              <li><button onClick={() => handleTabChange("industries")} className="hover:text-white">Infrastructure Projects</button></li>
              <li><button onClick={() => handleTabChange("industries")} className="hover:text-white">Energy Sourcing</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs uppercase tracking-widest mb-4">Administrative Desks</h4>
            <ul className="text-xs space-y-2 text-slate-400 font-mono">
              <li className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Suite 440, Jersey City, NJ
              </li>
              <li>
                <a href="mailto:jmeza@exoboll.com" className="hover:text-white">jmeza@exoboll.com</a>
              </li>
              <li>
                <button 
                  onClick={() => setShowAdminPanel(true)}
                  className="text-blue-400 hover:text-blue-300 underline text-[11px]"
                >
                  View Sourcing Registry Ledger
                </button>
              </li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}

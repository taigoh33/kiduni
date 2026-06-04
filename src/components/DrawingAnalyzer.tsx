import React, { useState, useRef } from "react";
import { 
  Upload, Sparkles, BookOpen, AlertCircle, ChevronLeft, 
  Volume2, VolumeX, Eye, Award, CheckCircle2, RotateCcw,
  Check, Play, Pause, Languages, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AICertificate, Language } from "../types";
import { useUsageLimit } from "../hooks/useUsageLimit";

interface DrawingAnalyzerProps {
  currentLang: Language;
  onBack: () => void;
  onSaveCertificate?: (certificate: AICertificate) => void;
  username?: string;
  isSubscribed?: boolean;
}

export const DrawingAnalyzer: React.FC<DrawingAnalyzerProps> = ({ 
  currentLang, 
  onBack, 
  onSaveCertificate,
  username = "",
  isSubscribed = false
}) => {
  // Config state
  const [analyzerLang, setAnalyzerLang] = useState<Language>(currentLang);
  const [ageGroup, setAgeGroup] = useState<"2-4" | "5-7" | "8-10">("5-7");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [rawAnalysis, setRawAnalysis] = useState<string | null>(null);
  const [parsedResults, setParsedResults] = useState<{
    analysis: { zh: string; en: string; ms: string };
    story: { zh: string; en: string; ms: string };
  } | null>(null);
  const [resultLang, setResultLang] = useState<Language>(currentLang);
  const [certificateClaimed, setCertificateClaimed] = useState(false);

  // Audio state
  const [isPlayingText, setIsPlayingText] = useState(false);
  const [synthInstance, setSynthInstance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.7);
  const [customKidName, setCustomKidName] = useState<string>(username || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLimitReached, remaining, incrementUsage, limit } = useUsageLimit('drawing_analyzer', isSubscribed);

  // Translation helpers
  const t = {
    zh: {
      title: "🎨 AI 智慧绘图分析",
      subtitle: "深度解密孩子的涂鸦世界，创作专属魔法双语童话",
      backBtn: "返回主页",
      step1: "第一步：选择儿童年龄段",
      step2: "第二步：上传手绘图或涂鸦",
      uploadPrompt: "拖拽手绘图片到这里，或点击上传",
      uploadSub: "支持 PNG、JPG 格式绘画",
      trySample: "没有准备手绘？试试这些精选画作样例：",
      age24: "2-4 岁 👶",
      age24Desc: "肌肉控制探索、无意涂鸦与色彩感知",
      age57: "5-7 岁 🧒",
      age57Desc: "情感表达、符号化绘画与萌芽性故事",
      age810: "8-10 岁 🧑",
      age810Desc: "空间关系、写实呈现与丰富逻辑思维",
      analyzeBtn: "开始魔法分析与故事创作 🔮",
      analyzing: "魔法雷达扫描中...",
      analyzingMsg: "正在解读神秘的画笔线条与斑斓色彩...",
      resultsTitle: "🌟 绘画奇妙解读报告",
      analysisCard: "💡 宝贝心声解读 (积极心理学导向)",
      storyCard: "📖 绘画专属奇遇童话",
      languages: "当前解读语言",
      claimCert: "🎖️ 领奖并保存证书",
      certClaimed: "✅ 证书已保存到收藏库！",
      reset: "分析新画作 🔄",
      soundOn: "魔法朗读",
      soundOff: "停止朗读",
      sampleLabel: "点击即可分析 ✨",
      parentTip: "💖 辅导建议：请多鼓励孩子的创作，无需强求完美真实度。"
    },
    en: {
      title: "🎨 AI Drawing Analysis",
      subtitle: "Unlock the magical meanings behind child scribbles & weave custom fairy tales",
      backBtn: "Back to Home",
      step1: "Step 1: Choose Child's Age",
      step2: "Step 2: Upload Drawing or Sketch",
      uploadPrompt: "Drag & drop drawings here, or click to browse",
      uploadSub: "Supports PNG, JPG artwork formats",
      trySample: "No drawing handy? Try our sample kid masterpieces:",
      age24: "Ages 2-4 👶",
      age24Desc: "Motor exploration, random scribbles & color fascination",
      age57: "Ages 5-7 🧒",
      age57Desc: "Emotional themes, symbol drawing & emerging plots",
      age810: "Ages 8-10 🧑",
      age810Desc: "Spatial relationships, realistic details & logical logic",
      analyzeBtn: "Analyze & Weave Magical Story 🔮",
      analyzing: "Powering AI Magic Wand...",
      analyzingMsg: "Decoding cosmic paint strokes and hidden pigments...",
      resultsTitle: "🌟 Creative Artwork Breakdown",
      analysisCard: "💡 Heart Voice Analysis (Child Psychology Concept)",
      storyCard: "📖 The Canvas Magic Fairy Tale",
      languages: "Report Language",
      claimCert: "🎖️ Claim & Save Certificate",
      certClaimed: "✅ Certificate Saved!",
      reset: "Analyze Another Drawing 🔄",
      soundOn: "Read Aloud",
      soundOff: "Stop Reading",
      sampleLabel: "Quick-try Masterpiece ✨",
      parentTip: "💖 Parent Tip: Focus on the journey and creativity, not realism or perfection!"
    },
    ms: {
      title: "🎨 Analisis Lukisan AI",
      subtitle: "Bongkar impian di sebalik contengan si cilik & cipta cerita dongeng magik",
      backBtn: "Kembali",
      step1: "Langkah 1: Pilih Umur Kanak-kanak",
      step2: "Langkah 2: Muat Naik Lukisan",
      uploadPrompt: "Seret & letak gambar di sini, atau klik untuk muat naik",
      uploadSub: "Sokong format seni lukis PNG, JPG",
      trySample: "Tiada lukisan? Cuba sampel karya agung ini:",
      age24: "Umur 2-4 👶",
      age24Desc: "Eksplorasi sensorimotor, lakaran rawak & minat warna",
      age57: "Umur 5-7 🧒",
      age57Desc: "Emosi terjelma, simbolik lukisan & permulaan plot",
      age810: "Umur 8-10 🧑",
      age810Desc: "Hubungan ruang, butiran realistik & logik berstruktur",
      analyzeBtn: "Mula Analisis & Jalinkan Dongeng 🔮",
      analyzing: "Skrin Sihir Berputar...",
      analyzingMsg: "Mentafsir titik sastera lukisan & rahsia warna-warni...",
      resultsTitle: "🌟 Laporan Seni Kreatif Cilik",
      analysisCard: "💡 Tafsiran Emosi (Aspek Psikologi Positif)",
      storyCard: "📖 Cerita Dongeng Magik Lukisan",
      languages: "Bahasa Laporan",
      claimCert: "🎖️ Tuntut & Simpan Sijil",
      certClaimed: "✅ Sijil Disimpan!",
      reset: "Analisis Lukisan Baru 🔄",
      soundOn: "Baca Nyaring",
      soundOff: "Berhenti Membaca",
      sampleLabel: "Cuba Contoh Ini ✨",
      parentTip: "💖 Tips Ibu Bapa: Beri sokongan padu kepada kreativiti anak tanpa mengira realisme!"
    }
  }[analyzerLang];

  // Helper to process raw gemini text format
  const parseGeminiOutput = (text: string) => {
    const defaultVal = {
      analysis: { zh: "", en: "", ms: "" },
      story: { zh: "", en: "", ms: "" }
    };

    try {
      const getTagContent = (tag: string, content: string) => {
        const regex = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\[[A-Z0-9_]+\\]|$)`, "i");
        const match = content.match(regex);
        return match ? match[1].trim() : "";
      };

      const results = {
        analysis: {
          zh: getTagContent("ANALYSIS_ZH", text) || "AI 正在细心整理报告中...",
          en: getTagContent("ANALYSIS_EN", text) || "AI is organizing the report details...",
          ms: getTagContent("ANALYSIS_MS", text) || "AI sedang menyusun laporan terperinci..."
        },
        story: {
          zh: getTagContent("STORY_ZH", text) || "精彩的魔法故事马上就到！",
          en: getTagContent("STORY_EN", text) || "The magical fairy tale will appear shortly!",
          ms: getTagContent("STORY_MS", text) || "Cerita sihir yang indah akan tiba dalam sekejap!"
        }
      };

      // Fallback in case tags are missing/corrupted
      if (!results.analysis.en && !results.analysis.zh) {
        // Simple plain text split if regex completely failed
        results.analysis.en = text.substring(0, Math.min(250, text.length));
        results.story.en = text.substring(Math.min(250, text.length));
      }

      return results;
    } catch (e) {
      console.error("Parsing Gemini response error:", e);
      return defaultVal;
    }
  };

  // Analyze service call
  const handleAnalyze = async () => {
    if (isLimitReached) {
      setError(analyzerLang === "zh" ? `您已达到今日生成限制（${limit}次）。请明天再来！` : analyzerLang === "ms" ? `Anda telah mencapai had harian (${limit} kali).` : `You have reached your daily limit (${limit} times).`);
      return;
    }

    if (!selectedImage) {
      setError(analyzerLang === "zh" ? "请先上传画作照片！" : analyzerLang === "ms" ? "Sila muat naik lukisan terlebih dahulu!" : "Please upload a drawing first!");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setCertificateClaimed(false);

    try {
      const response = await fetch("/api/ai/analyze-drawing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          ageGroup: ageGroup
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (!data.analysis) {
        throw new Error("No analysis result received from server.");
      }

      setRawAnalysis(data.analysis);
      const parsed = parseGeminiOutput(data.analysis);
      setParsedResults(parsed);
      incrementUsage();
    } catch (err: any) {
      console.error("Analysis API failed:", err);
      setError(err.message || "Something went wrong while communicating with Gemini API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image upload utilities
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Read Aloud / TTS functions
  const handleToggleReadAloud = () => {
    if (isPlayingText) {
      window.speechSynthesis?.cancel();
      setIsPlayingText(false);
      return;
    }

    if (!parsedResults) return;

    // We speech read the current active result language
    const currentStory = parsedResults.story[resultLang];
    const currentAnalysis = parsedResults.analysis[resultLang];
    const textToSpeak = `${currentStory}. ${currentAnalysis}`;

    // Map resultLang to SpeechSynthesis language code
    const langCodes: Record<Language, string> = {
      zh: "zh-CN",
      en: "en-US",
      ms: "ms-MY"
    };

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCodes[resultLang];
    utterance.rate = speechRate; // Dynamically adjusted speech rate

    utterance.onend = () => {
      setIsPlayingText(false);
    };

    utterance.onerror = () => {
      setIsPlayingText(false);
    };

    window.speechSynthesis?.cancel(); // Cancel any existing speech
    window.speechSynthesis?.speak(utterance);
    setSynthInstance(utterance);
    setIsPlayingText(true);
  };

  // Create & Register Creative Certificate
  const handleClaimCertificate = () => {
    if (!parsedResults || !onSaveCertificate) return;

    const kidName = customKidName.trim() || username || (analyzerLang === "zh" ? "聪明小宝贝" : analyzerLang === "ms" ? "Adik Pintar" : "Little Explorer");
    
    // Choose title based on group or languages
    const titleText = parsedResults.story[analyzerLang].substring(0, 15) || (analyzerLang === "zh" ? "神奇画笔的创想" : "Canvas Magic");

    const newCertificate: AICertificate = {
      id: "cert-" + Date.now(),
      type: "drawing",
      title: titleText,
      date: new Date().toLocaleDateString(analyzerLang === "zh" ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      previewImage: selectedImage || undefined,
      content: parsedResults.story[analyzerLang],
      analysis: parsedResults.analysis[analyzerLang],
      studentName: kidName
    };

    onSaveCertificate(newCertificate);
    setCertificateClaimed(true);
  };

  const resetAll = () => {
    setSelectedImage(null);
    setRawAnalysis(null);
    setParsedResults(null);
    setCertificateClaimed(false);
    setCustomKidName(username || "");
    setError(null);
    window.speechSynthesis?.cancel();
    setIsPlayingText(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 select-none font-sans">
      {/* Dynamic Navigation/Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 mb-4 border-b-2 border-amber-200/50">
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              window.speechSynthesis?.cancel();
              onBack();
            }}
            className="px-5 py-2.5 bg-white text-orange-500 rounded-2xl shadow-md hover:bg-orange-50 border-2 border-orange-100 transition-all flex items-center gap-2 font-black text-sm"
          >
            <ChevronLeft size={18} strokeWidth={3} />
            <span>{t.backBtn}</span>
          </button>

          {parsedResults && onSaveCertificate && (
            <button
              type="button"
              disabled={certificateClaimed}
              onClick={handleClaimCertificate}
              className={`px-5 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                certificateClaimed 
                  ? 'bg-rose-100 text-rose-600 border border-rose-200 pointer-events-none' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-white hover:scale-102 active:scale-95 border-2 border-white'
              }`}
            >
              <Award size={16} />
              <span>{certificateClaimed ? t.certClaimed : t.claimCert}</span>
            </button>
          )}
        </div>

        {/* Global 3-Languages Selector for AI Drawing Section */}
        <div className="flex bg-orange-100/60 p-1 rounded-2xl border border-orange-200 shadow-inner">
          <button 
            onClick={() => setAnalyzerLang("zh")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${analyzerLang === "zh" ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md scale-105" : "text-amber-800 hover:bg-orange-50"}`}
          >
            简体中文
          </button>
          <button 
            onClick={() => setAnalyzerLang("en")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${analyzerLang === "en" ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md scale-105" : "text-amber-800 hover:bg-orange-50"}`}
          >
            English
          </button>
          <button 
            onClick={() => setAnalyzerLang("ms")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${analyzerLang === "ms" ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md scale-105" : "text-amber-800 hover:bg-orange-50"}`}
          >
            Bahasa Melayu
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-indigo-950 flex items-center justify-center gap-3 drop-shadow-sm"
        >
          {t.title}
        </motion.h1>
        <p className="text-sm md:text-base text-pink-600 font-bold mt-2 uppercase tracking-wide">
          {t.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!parsedResults ? (
          <motion.div 
            key="config-phase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
          >
            {/* Left controls panel - Step 1 & 2 */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Box 1: Age category */}
              <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-xl border-4 border-orange-200">
                <h3 className="text-xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-sm border border-orange-200">1</span>
                  {t.step1}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "2-4", label: t.age24, desc: t.age24Desc, color: "from-teal-400 to-cyan-500", border: "border-teal-200", bg: "bg-teal-50/50" },
                    { id: "5-7", label: t.age57, desc: t.age57Desc, color: "from-orange-400 to-amber-500", border: "border-orange-200", bg: "bg-orange-50/50" },
                    { id: "8-10", label: t.age810, desc: t.age810Desc, color: "from-pink-400 to-rose-500", border: "border-pink-200", bg: "bg-rose-50/50" }
                  ].map((age) => (
                    <button
                      key={age.id}
                      onClick={() => setAgeGroup(age.id as any)}
                      className={`p-4 rounded-3xl border-4 transition-all text-left flex flex-col justify-between min-h-[120px] group ${
                        ageGroup === age.id 
                          ? `border-indigo-500 bg-indigo-50/60 shadow-md scale-102` 
                          : `${age.border} bg-white hover:border-orange-350 hover:bg-orange-50/10`
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-lg font-black text-indigo-950">{age.label}</span>
                        {ageGroup === age.id && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                            <Check size={12} strokeWidth={5} />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-500 leading-snug mt-2 group-hover:text-indigo-950 transition-colors">
                        {age.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Box 2: Image Uploader */}
              <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-xl border-4 border-orange-200">
                <h3 className="text-xl font-black text-indigo-950 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-sm border border-orange-200">2</span>
                  {t.step2}
                </h3>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden" 
                />

                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerUploadClick}
                  className={`border-4 border-dashed rounded-[35px] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[220px] ${
                    isDragging 
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                      : selectedImage 
                        ? "border-emerald-300 bg-emerald-50/10" 
                        : "border-amber-200 hover:border-amber-400 bg-amber-50/10 text-amber-900"
                  }`}
                >
                  {selectedImage ? (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="relative w-40 h-40 rounded-[24px] overflow-hidden shadow-md border-4 border-white">
                        <img src={selectedImage} alt="Artwork preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-white" size={28} />
                        </div>

                        {/* Trash Button inside the preview box, top-right */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          title={analyzerLang === "zh" ? "删除并重新上传" : analyzerLang === "ms" ? "Buang dan muat naik semula" : "Delete and re-upload"}
                          className="absolute top-2 right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer z-20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Image Loaded successfully!
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 bounce-anim">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-indigo-950 text-base">{t.uploadPrompt}</p>
                        <p className="text-xs font-bold text-gray-400 mt-1">{t.uploadSub}</p>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Error indicator */}
              {error && (
                <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs font-bold text-rose-700 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Submit Trigger Action */}
              <button
                type="button"
                disabled={!selectedImage || isAnalyzing}
                onClick={handleAnalyze}
                className={`w-full py-5 rounded-[30px] font-black text-lg shadow-xl shadow-orange-500/10 flex items-center justify-center gap-3 transition-all ${
                  !selectedImage 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" 
                    : isAnalyzing 
                      ? "bg-indigo-600 text-white cursor-wait animate-pulse" 
                      : "bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 hover:scale-[1.01] active:translate-y-0.5 text-white cursor-pointer"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-4 border-dashed border-white animate-spin shrink-0" />
                    <span>{t.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} className="text-yellow-300 animate-spin" />
                    <span>{t.analyzeBtn}</span>
                  </>
                )}
              </button>

              {/* Remaining indicator */}
              <div className="text-center mt-2 select-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-black text-indigo-600 shadow-sm">
                  <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                  <span>
                    {analyzerLang === 'zh' 
                      ? `今日剩余画作分析次数: ${remaining}/${limit}` 
                      : analyzerLang === 'ms' 
                        ? `Baki analisis hari ini: ${remaining}/${limit}` 
                        : `Remaining drawing analyses today: ${remaining}/${limit}`}
                  </span>
                </span>
              </div>

            </div>

            {/* Right decorative panel with child advice */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-gradient-to-b from-indigo-900 to-purple-950 text-white p-8 rounded-[40px] shadow-xl border-4 border-indigo-950 relative overflow-hidden flex-1 justify-center flex flex-col gap-4">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-white text-[12rem] pointer-events-none font-black select-none">
                  🎨
                </div>
                
                <h4 className="text-xl font-black flex items-center gap-2 text-yellow-300 select-none">
                  🌟 Quick Guide
                </h4>

                <div className="space-y-4 text-xs font-bold leading-relaxed text-indigo-150">
                  <p className="border-l-3 border-pink-400 pl-3">
                    {analyzerLang === "zh" 
                      ? "每个孩子的乱涂乱画和画纸边界都映射出其当下的空间和发展逻辑。不要直接评判画得「像不像」，更重要的是倾听画画背后的童心密语。" 
                      : "Every scribble and canvas outline mirrors a kid's developmental logic. Encourage self-expression instead of judging correctness."}
                  </p>
                  <p className="border-l-3 border-[#2dd4bf] pl-3">
                    {analyzerLang === "zh" 
                      ? "AI 绘画雷达能分析红、黄、绿等典型彩铅配对及画中人景比例，借助正向心理模型为父母提供温柔、非医疗性的沟通建议。" 
                      : "AI scans color palettes and character scales to offer reassuring parental feedback in alignment with artistic expression."}
                  </p>
                  <p className="border-l-3 border-yellow-300 pl-3">
                    {t.parentTip}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-yellow-300">
                    <Award size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-xs">Certified Report</h5>
                    <p className="text-[10px] text-indigo-200">Includes Custom Creativity Trophy</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="results-phase"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-8 mb-16"
          >
            {/* Header with Languages Report Toggler */}
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-[32px] shadow-md border-2 border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-base font-black text-indigo-950 flex items-center gap-2">
                <Sparkles size={20} className="text-pink-500 shrink-0" />
                {t.resultsTitle}
              </span>

              {/* 3 languages selector FOR the drawing report */}
              <div className="flex bg-indigo-50 border border-indigo-150 p-1 rounded-xl">
                {[
                  { code: 'zh', text: '简体中文' },
                  { code: 'en', text: 'English' },
                  { code: 'ms', text: 'B. Melayu' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setResultLang(l.code as Language)}
                    className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all ${
                      resultLang === l.code 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-indigo-900 hover:bg-white/50'
                    }`}
                  >
                    {l.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Split: Left Art visual, Right detailed breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Picture frame */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white p-5 rounded-[40px] shadow-xl border-8 border-[#8B5A2B] relative overflow-hidden flex flex-col items-center">
                  {/* Rope details on canvas top */}
                  <div className="w-16 h-4 bg-gray-300 rounded-full mb-4 opacity-50 shadow-inner" />
                  
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border-4 border-orange-50/50 shadow-inner">
                    {selectedImage && (
                      <img src={selectedImage} alt="Analyzed masterpiece" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  {/* Decorative tag */}
                  <div className="mt-4 px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 text-[10px] font-black uppercase tracking-wider">
                    {analyzerLang === "zh" ? `${ageGroup}岁 绘画艺术家` : `${ageGroup} Years Artist`} 🖼️
                  </div>
                </div>

                {/* Read Aloud Controller panel with Speed Adjuster */}
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-[32px] border-2 border-orange-100/60 shadow-md flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleReadAloud()}
                    className={`w-full py-3.5 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPlayingText 
                        ? 'bg-rose-50 border-rose-200 text-rose-500' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100/50'
                    }`}
                  >
                    {isPlayingText ? (
                      <>
                        <VolumeX size={18} className="animate-bounce shrink-0" />
                        <span>{t.soundOff}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={18} className="shrink-0 animate-pulse" />
                        <span>{t.soundOn}</span>
                      </>
                    )}
                  </button>

                  {/* Speech Rate Controller Slider */}
                  <div className="flex flex-col gap-1.5 px-1 bg-orange-50/30 p-3 rounded-2xl border border-orange-100/50">
                    <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                      <span>{resultLang === 'zh' ? '🎙️ 三语朗读语速' : resultLang === 'ms' ? '🎙️ Kelajuan Suara' : '🎙️ Read Speed'}</span>
                      <span className="font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[10px]">{speechRate}x</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-900/40 select-none">{resultLang === 'zh' ? '慢' : resultLang === 'ms' ? 'Lambat' : 'Slow'}</span>
                      <input 
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSpeechRate(val);
                          if (isPlayingText) {
                            window.speechSynthesis?.cancel();
                            setIsPlayingText(false);
                          }
                        }}
                        className="flex-1 accent-orange-500 h-1.5 bg-gray-100 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] font-black text-indigo-900/40 select-none">{resultLang === 'zh' ? '快' : resultLang === 'ms' ? 'Laju' : 'Fast'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Breakdown cards */}
              <div className="lg:col-span-7 flex flex-col gap-6 font-sans">
                
                {/* Baby Name input block */}
                <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-xl border-4 border-pink-200/80 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-pink-600 text-6xl pointer-events-none select-none">
                    ⭐
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-base font-black text-indigo-950 flex flex-col gap-0.5">
                      <span>{analyzerLang === "zh" ? "宝贝的名字" : analyzerLang === "ms" ? "Nama Anak" : "Child's Name"}</span>
                      <span className="text-xs text-indigo-900/60 font-bold">
                        {analyzerLang === "zh" ? "（输入名字，让宝贝名字在证书出现）" : analyzerLang === "ms" ? "Masukkan nama, letakkan anak anda sebagai watak utama..." : "Enter name to make your child the hero..."}
                      </span>
                    </label>
                    <input
                      type="text"
                      disabled={certificateClaimed}
                      value={customKidName}
                      onChange={(e) => setCustomKidName(e.target.value)}
                      placeholder={analyzerLang === "zh" ? "输入名字，让宝贝名字在证书出现" : analyzerLang === "ms" ? "Taip nama di sini..." : "Type name here..."}
                      className="w-full px-5 py-3.5 rounded-2xl bg-orange-50/20 border-2 border-orange-100 font-bold text-sm text-indigo-950 focus:border-pink-300 outline-none transition-all placeholder:text-indigo-900/30 disabled:opacity-60 disabled:bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Visualizer Analysis Breakdown */}
                <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-xl border-4 border-teal-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-900 text-6xl pointer-events-none select-none">
                    💡
                  </div>
                  <h4 className="text-lg font-black text-indigo-950 mb-3 flex items-center gap-2">
                    {t.analysisCard}
                  </h4>
                  <p className="text-sm font-medium text-indigo-900/80 leading-relaxed whitespace-pre-wrap">
                    {parsedResults.analysis[resultLang]}
                  </p>
                </div>

                {/* Magical Story Breakdown */}
                <div className="bg-gradient-to-b from-[#FFFDF8] to-[#FCF4DF] p-6 md:p-8 rounded-[40px] shadow-xl border-4 border-amber-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-orange-500 text-6xl pointer-events-none select-none">
                    📖
                  </div>
                  <h4 className="text-lg font-black text-amber-900 mb-3 flex items-center gap-2">
                    {t.storyCard}
                  </h4>
                  <p className="text-sm font-medium text-amber-950 leading-relaxed whitespace-pre-wrap italic bg-white/40 p-4 rounded-2xl border border-dashed border-amber-200">
                    "{parsedResults.story[resultLang]}"
                  </p>
                </div>

                {/* Notification Banner when saved */}
                {certificateClaimed && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-3xl text-emerald-800 font-bold text-xs flex items-center gap-2 animate-bounce">
                    <span>✨ {t.certClaimed}</span>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom Actions Row to Reset */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={resetAll}
                className="px-8 py-3.5 bg-indigo-600 text-white font-black text-sm rounded-2xl shadow-xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={16} strokeWidth={3} />
                <span>{t.reset}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      <div className="h-10" />
    </div>
  );
};

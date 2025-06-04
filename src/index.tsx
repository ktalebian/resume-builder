import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useReactToPrint } from "react-to-print";
import {
  FaLinkedin,
  FaGithub,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import {
  Markdown,
  LeftPanelProject,
  Tag,
  LeftPanelProjectItem,
} from "./components";
import Editor from "@monaco-editor/react";
import "./index.css";

interface ContactInfo {
  name: string;
  title: string;
  website?: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

interface Experience {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  tags: string[];
  bullets: string[];
}

interface Skill {
  expert?: string;
  proficient?: string;
  low?: string;
  name?: string;
  descriptions?: string[];
}

interface SkillCategory {
  [category: string]: Skill;
}

interface Resume {
  contact: ContactInfo;
  summaries: string[];
  educations: LeftPanelProjectItem[];
  skills: SkillCategory;
  experiences: Experience[];
  projects: LeftPanelProjectItem[];
}

function ResumeComponent() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [resume, setResume] = useState<Resume>({} as Resume);
  const [error, setError] = useState<string>("");
  const [isJsonEditorCollapsed, setIsJsonEditorCollapsed] =
    useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [savedJsonInput, setSavedJsonInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const response = await fetch("/api/load-resume");
        if (response.ok) {
          const data = await response.text();
          const parsedData = JSON.parse(data);
          // Validate structure before using
          if (!parsedData.contact || !parsedData.contact.name) {
            throw new Error("Invalid resume structure in saved file");
          }
          setJsonInput(data);
          setSavedJsonInput(data);
          setResume(parsedData);
          setHasUnsavedChanges(false);
        }
      } catch (err) {
        console.error("Failed to load resume data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeData();
  }, []);

  const handleJsonUpdate = (newJson: string) => {
    setJsonInput(newJson);
    setHasUnsavedChanges(newJson !== savedJsonInput);
    try {
      const parsed = JSON.parse(newJson);
      // Validate required structure
      if (!parsed.contact || !parsed.contact.name) {
        setError(
          "Invalid resume structure: 'contact' object with 'name' field is required",
        );
        return;
      }
      setResume(parsed);
      setError("");
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonInput,
      });

      if (response.ok) {
        setSavedJsonInput(jsonInput);
        setHasUnsavedChanges(false);
      } else {
        console.error("Save failed:", response.statusText);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `KoushaTalebian_Resume`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0 !important;
        }
      }
    `,
  });

  if (isLoading || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-600">Loading resume data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div
        className={`max-w-[1600px] mx-auto grid grid-cols-1 ${isJsonEditorCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-3"} gap-6`}
      >
        {/* JSON Input Panel - 1/3 width when expanded, minimal when collapsed */}
        <div
          className={`${isJsonEditorCollapsed ? "fixed left-4 top-4 z-10" : "lg:col-span-1"} bg-white rounded-lg shadow-lg ${isJsonEditorCollapsed ? "p-2" : "p-6"} h-fit ${isJsonEditorCollapsed ? "" : "sticky top-4"}`}
        >
          <div className="flex justify-between items-center mb-3">
            <div
              className={`${isJsonEditorCollapsed ? "text-sm" : "text-xl"} font-bold`}
            >
              {isJsonEditorCollapsed ? "JSON" : "Resume JSON Data"}
              {hasUnsavedChanges && !isJsonEditorCollapsed && (
                <span className="text-orange-500 ml-2">*</span>
              )}
            </div>
            <button
              onClick={() => setIsJsonEditorCollapsed(!isJsonEditorCollapsed)}
              className="text-gray-600 hover:text-gray-800 p-1"
              title={
                isJsonEditorCollapsed ? "Expand editor" : "Collapse editor"
              }
            >
              {isJsonEditorCollapsed ? "▶" : "◀"}
            </button>
          </div>

          {!isJsonEditorCollapsed && (
            <>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  height="600px"
                  defaultLanguage="json"
                  value={jsonInput}
                  onChange={(value) => handleJsonUpdate(value || "")}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    automaticLayout: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    folding: true,
                    bracketPairColorization: { enabled: true },
                  }}
                  theme="vs"
                />
              </div>
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}

              <div className="mt-4 space-y-1">
                <button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className={`w-full px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                    hasUnsavedChanges
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save JSON
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Print/Save as PDF
                </button>
              </div>
            </>
          )}

          {isJsonEditorCollapsed && (
            <button
              onClick={handlePrint}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              title="Print/Save as PDF"
            >
              🖨️ PDF
            </button>
          )}
        </div>

        <div
          className={`${isJsonEditorCollapsed ? "lg:col-span-1" : "lg:col-span-2"} bg-white rounded-lg shadow-lg`}
        >
          <div ref={resumeRef} className="p-4">
            <div className="screen-layout">
              <div className="print-left-column space-y-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {resume.contact.name}
                  </div>
                  <div className="text-lg text-gray-600 mb-3">
                    {resume.contact.title}
                  </div>

                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaGlobe className="w-4 h-4 text-gray-600" />
                      <span>{resume.contact.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-gray-600" />
                      <span>{resume.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-4 h-4 text-gray-600" />
                      <span>{resume.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaLinkedin className="w-4 h-4 text-gray-600" />
                      <span>{resume.contact.linkedin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGithub className="w-4 h-4 text-gray-600" />
                      <span>{resume.contact.github}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-lg font-bold text-gray-900 mb-3">
                    Technical Skills
                  </div>
                  <div className="space-y-4">
                    {Object.entries(resume.skills).map(([name, skill]) => (
                      <div key={name}>
                        <div className="font-semibold text-sm text-gray-800 mb-2">
                          {name}
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                          {skill.expert &&
                            typeof skill.expert === "string" &&
                            skill.expert.trim() && (
                              <div>
                                <Markdown>
                                  {`**Expert:** ${skill.expert}`}
                                </Markdown>
                              </div>
                            )}
                          {skill.proficient &&
                            typeof skill.proficient === "string" &&
                            skill.proficient.trim() && (
                              <div>
                                <Markdown>
                                  {`**Proficient:** ${skill.proficient}`}
                                </Markdown>
                              </div>
                            )}
                          {skill.low &&
                            typeof skill.low === "string" &&
                            skill.low.trim() && (
                              <div>
                                <Markdown>{`**Low:** ${skill.low}`}</Markdown>
                              </div>
                            )}
                          <div className="space-y-1">
                            {(skill.descriptions ?? []).map((desc) => (
                              <Markdown>{desc.trim()}</Markdown>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <LeftPanelProject
                  section="Personal Projects"
                  items={resume.projects}
                />

                <LeftPanelProject
                  // roleInline
                  section="Education"
                  items={resume.educations}
                />
              </div>

              <div className="print-right-column space-y-4">
                <div className="space-y-1">
                  {resume.summaries.map((summary) => (
                    <Markdown className="text-sm text-gray-700 leading-relaxed">
                      {summary.trim()}
                    </Markdown>
                  ))}
                </div>

                <div className="space-y-4">
                  {resume.experiences.map((job, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900">
                            {job.company}{" "}
                            <span className="font-normal text-gray-800">
                              ({job.role})
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-600 align-bottom">
                          {job.location} | {job.startDate} — {job.endDate}
                        </div>
                      </div>

                      <div className="mb-2">
                        {job.tags.map((tag, tagIndex) => (
                          <Tag key={tagIndex}>{tag}</Tag>
                        ))}
                      </div>

                      <ul className="text-sm text-gray-700">
                        {job.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex">
                            <span className="mr-2">•</span>
                            <Markdown>{bullet}</Markdown>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeComponent;

// Mount the app to the DOM

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ResumeComponent />
  </React.StrictMode>,
);

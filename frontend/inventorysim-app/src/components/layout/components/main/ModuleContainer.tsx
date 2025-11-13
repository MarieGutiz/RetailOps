import type { ReactNode } from "react";
import PrimeBreadcrumb from "./PrimeBreadcrumb";

interface ModuleContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbTrail?: { label: string; path?: string }[];
  userCases?: string[]; // Combo box options
  onUserCaseChange?: (value: string) => void;
  actions?: ReactNode; // Extra buttons
  children: ReactNode; // Module content
}

const ModuleContainer: React.FC<ModuleContainerProps> = ({
  title,
  subtitle,
  breadcrumbTrail,
  userCases,
  onUserCaseChange,
  actions,
  children,
}) => {
   return (
    <div className="flex-1 flex flex-col p-6 bg-gray-50 min-h-full">
      {/* Header row: title left, controls right */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="j-heading j-h1">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2">
          {userCases && userCases.length > 0 && (
            <select
              className="toolbar-element jcombo-box toolbar-element-md"
              onChange={(e) => onUserCaseChange?.(e.target.value)}
            >
              {userCases.map((uc, i) => (
                <option key={i} value={uc}>
                  {uc}
                </option>
              ))}
            </select>
          )}
          {actions && actions}
        </div>
      </div>

      {/* Breadcrumb below header */}
      {breadcrumbTrail && breadcrumbTrail.length > 0 && (
        <div className="mb-4">
          <PrimeBreadcrumb trail={breadcrumbTrail} />
        </div>
      )}

      {/* Module content */}
      <main className="flex-1 bg-white rounded-lg shadow p-4 min-h-[400px]">
        {children}
      </main>
    </div>
  );
}

export default ModuleContainer
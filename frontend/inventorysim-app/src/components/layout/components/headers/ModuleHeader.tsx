import type { ReactNode } from "react";
import PrimeBreadcrumb from "../main/PrimeBreadcrumb";

interface ModuleContainerProps {
  title: string
  subtitle?: string
  breadcrumbTrail?: { label: string; path?: string }[]
  userCases?: string[]
  onUserCaseChange?: (value: string) => void
  actions?: ReactNode
}


const ModuleHeader:React.FC<ModuleContainerProps>= ({
      title,
      subtitle,
      breadcrumbTrail,
      userCases = [],
      onUserCaseChange,
      actions,
}: ModuleContainerProps) => {
  return (
    <>
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
    </>
  );
}

export default ModuleHeader
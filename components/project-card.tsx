"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import DonutChart from "./donut-chart"
import type { Project } from "@/lib/firestore"

interface ProjectCardProps {
  project: Project
  onProjectClick: (project: Project, element: HTMLElement) => void
  isSelected?: boolean
}

export default function ProjectCard({ project, onProjectClick, isSelected = false }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    if (cardRef.current) {
      onProjectClick(project, cardRef.current)
    }
  }

  // Проверяем корректность данных проекта
  const safeProject = {
    ...project,
    newRequests: Math.max(0, Number(project.newRequests) || 0),
    accepted: Math.max(0, Number(project.accepted) || 0),
    rejected: Math.max(0, Number(project.rejected) || 0),
    totalRequests: Math.max(0, Number(project.totalRequests) || 0),
  }

  return (
    <motion.div
      ref={cardRef}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileTap={
        !isSelected
          ? {
              scale: 0.95,
              transition: { duration: 0.15, ease: "easeOut" },
            }
          : {}
      }
    >
      {/* Card */}
      <motion.div
        className="relative aspect-square w-full rounded-xl bg-[#1F2937] p-3 sm:p-4 shadow-lg border border-transparent transition-all duration-300"
        style={{
          borderRadius: "12px",
        }}
        animate={{
          borderColor: isHovered && !isSelected ? "#3B82F6" : "transparent",
          backgroundColor: isHovered && !isSelected ? "#243448" : "#1F2937",
          boxShadow: isHovered && !isSelected
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Donut Chart */}
        <div className="flex h-full flex-col items-center justify-center">
          <motion.div
            className="mb-2 sm:mb-3"
            animate={{
              scale: isHovered && !isSelected ? 1.08 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="h-14 w-14 sm:h-16 sm:w-16">
              <DonutChart
                newRequests={safeProject.newRequests}
                accepted={safeProject.accepted}
                rejected={safeProject.rejected}
                color={project.color}
                isHovered={isHovered && !isSelected}
              />
            </div>
          </motion.div>

          {/* Project Name */}
          <motion.h3
            className="text-center text-sm sm:text-base font-medium text-[#E5E7EB] font-inter line-clamp-2 leading-tight px-1"
            animate={{
              scale: isHovered && !isSelected ? 1.05 : 1,
              color: isHovered && !isSelected ? "#F3F4F6" : "#E5E7EB",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {project.name}
          </motion.h3>

          {/* Quick stats on hover for larger screens */}
          <motion.div
            className="hidden sm:block mt-2 text-center opacity-0"
            animate={{
              opacity: isHovered && !isSelected ? 1 : 0,
              y: isHovered && !isSelected ? 0 : 10,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="text-xs text-[#9CA3AF] font-inter">
              {safeProject.totalRequests} заявок
            </div>
          </motion.div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-[#3B82F6] pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Touch feedback overlay for mobile */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-[#3B82F6] opacity-0 pointer-events-none sm:hidden"
          animate={{
            opacity: isHovered ? 0.1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </motion.div>
  )
}

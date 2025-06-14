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
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : {}
      }
    >
      {/* Card */}
      <motion.div
        className="relative aspect-square w-full rounded-lg sm:rounded-xl bg-[#1F2937] p-2 sm:p-3 shadow-lg"
        style={{
          borderRadius: "8px",
        }}
      >
        {/* Donut Chart */}
        <div className="flex h-full flex-col items-center justify-center">
          <motion.div
            className="mb-2"
            animate={{
              scale: isHovered && !isSelected ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-12 w-12 sm:h-16 sm:w-16">
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
            className="text-center text-xs sm:text-sm font-medium text-[#E5E7EB] font-inter line-clamp-2 mt-1 sm:mt-2"
            animate={{
              scale: isHovered && !isSelected ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {project.name}
          </motion.h3>
        </div>
      </motion.div>
    </motion.div>
  )
}

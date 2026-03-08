import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ProjectCard from './ProjectCard.jsx';
import ProjectModal from './ProjectModal.jsx';
import ProjectFilters from './ProjectFilters.jsx';
import ProjectComparePanel from './ProjectComparePanel.jsx';
import ShimmerSkeleton from '../ui/ShimmerSkeleton.jsx';
import { projects as staticProjects } from '../../data/projectsData.js';
import { fetchProjects } from '../../services/api.js';
import { fetchGitHubStats } from '../../services/github.js';
import { useAnalytics } from '../../hooks/useAnalytics.js';

function normalizeProject(project, index) {
  const features = (project.features || []).map((item) =>
    typeof item === 'string'
      ? { title: `Feature ${index + 1}`, icon: 'FT', detail: item }
      : item,
  );

  const challenges = (project.challenges || []).map((item) =>
    typeof item === 'string'
      ? { challenge: item, solution: 'Iterated on implementation and tested alternatives.' }
      : item,
  );

  return {
    ...project,
    date: project.date || `2025-0${(index % 8) + 1}-15`,
    complexity: project.complexity || ((index % 5) + 1),
    difficulty: project.difficulty || ((index % 4) + 2),
    screenshot:
      project.screenshot ||
      `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80`,
    architecture:
      project.architecture ||
      [
        { name: 'Frontend', role: `${project.techStack?.[0] || 'React'} user interface` },
        { name: 'Backend', role: `${project.techStack?.[1] || 'Node.js'} API services` },
        { name: 'Database', role: `${project.techStack?.[2] || 'SQL'} data persistence` },
      ],
    features,
    challenges,
    codeSnippets:
      project.codeSnippets ||
      [
        {
          label: 'Core Logic',
          language: 'javascript',
          code: `function runProjectWorkflow(input) {\n  return transformAndValidate(input);\n}`,
        },
      ],
    metrics:
      project.metrics ||
      [
        { label: 'Lighthouse Perf', value: 80 },
        { label: 'API Stability', value: 82 },
      ],
  };
}

function sortProjects(items, sortBy) {
  const copy = [...items];
  switch (sortBy) {
    case 'date-asc':
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'complexity-desc':
      return copy.sort((a, b) => b.complexity - a.complexity);
    case 'complexity-asc':
      return copy.sort((a, b) => a.complexity - b.complexity);
    case 'date-desc':
    default:
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

async function shareProject(project) {
  const hasLiveDemo =
    project.demo && project.demo.startsWith('http') && !project.demo.includes('example.com');
  const shareData = {
    title: project.title,
    text: `Check out this project by Habtamu Shewamene: ${project.title}`,
    url: hasLiveDemo ? project.demo : project.github,
  };
  if (navigator.share) {
    await navigator.share(shareData);
    return;
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareData.url);
  }
}

export default function ProjectGrid() {
  const [projects, setProjects] = useState(staticProjects.map(normalizeProject));
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTech, setActiveTech] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [compareIds, setCompareIds] = useState([]);
  const [githubStatsMap, setGithubStatsMap] = useState({});
  const [shareNotice, setShareNotice] = useState('');
  const reducedMotion = useReducedMotion();
  const { trackEvent } = useAnalytics();
  const githubStatsEnabled = import.meta.env.VITE_ENABLE_GITHUB_STATS === 'true';

  useEffect(() => {
    async function load() {
      try {
        const apiProjects = await fetchProjects();
        if (Array.isArray(apiProjects) && apiProjects.length > 0) {
          setProjects(apiProjects.map(normalizeProject));
        } else {
          setProjects(staticProjects.map(normalizeProject));
        }
      } catch {
        setProjects(staticProjects.map(normalizeProject));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!githubStatsEnabled) {
      setGithubStatsMap({});
      return undefined;
    }

    let isMounted = true;
    async function loadGitHubStats() {
      const pairs = await Promise.all(
        projects.map(async (project) => [project.id, await fetchGitHubStats(project.github)]),
      );
      if (!isMounted) return;
      setGithubStatsMap(Object.fromEntries(pairs));
    }
    loadGitHubStats();
    return () => {
      isMounted = false;
    };
  }, [githubStatsEnabled, projects]);

  const techOptions = useMemo(() => {
    const allTech = new Set();
    projects.forEach((project) => {
      project.techStack?.forEach((tech) => allTech.add(tech));
    });
    return [...allTech].sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const matchesTech = activeTech === 'All' || project.techStack?.includes(activeTech);
      const matchesQuery =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack?.some((tech) => tech.toLowerCase().includes(query)) ||
        project.features?.some((feature) => feature.detail.toLowerCase().includes(query));
      return matchesTech && matchesQuery;
    });
    return sortProjects(filtered, sortBy);
  }, [activeTech, projects, search, sortBy]);

  const comparedProjects = useMemo(
    () => projects.filter((project) => compareIds.includes(project.id)),
    [compareIds, projects],
  );

  const handleCompareToggle = (projectId) => {
    setCompareIds((prev) => {
      if (prev.includes(projectId)) return prev.filter((id) => id !== projectId);
      if (prev.length >= 2) return [prev[1], projectId];
      return [...prev, projectId];
    });
  };

  const handleShare = async (project) => {
    try {
      await shareProject(project);
      setShareNotice('Project link shared.');
    } catch {
      setShareNotice('Unable to share project link on this device.');
    }
    window.setTimeout(() => setShareNotice(''), 1800);
  };

  const handleTrackProjectView = (projectId) => {
    trackEvent({
      eventType: 'project_view',
      projectId,
      page: 'projects-section',
    });
  };

  const handleTrackProjectClick = (projectId, projectAction) => {
    trackEvent({
      eventType: 'project_click',
      projectId,
      projectAction,
      page: 'projects-section',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="theme-text-primary font-heading text-2xl font-semibold sm:text-3xl">
          Advanced <span className="theme-text-accent">Project Showcase</span>
        </h2>
        <p className="theme-text-muted mt-2 max-w-2xl text-sm">
          Explore Habtamu&apos;s projects with stack-aware filters, GitHub metadata, code previews,
          comparison tools, and deep technical breakdowns.
        </p>
      </div>

      <ProjectFilters
        techOptions={techOptions}
        activeTech={activeTech}
        onTechToggle={setActiveTech}
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        resultCount={filteredProjects.length}
      />

      {shareNotice && <p className="theme-text-accent text-xs">{shareNotice}</p>}

      <ProjectComparePanel
        projects={comparedProjects}
        onRemove={(id) => setCompareIds((prev) => prev.filter((item) => item !== id))}
        onClear={() => setCompareIds([])}
      />

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ShimmerSkeleton className="h-80" />
          <ShimmerSkeleton className="h-80" />
          <ShimmerSkeleton className="h-80" />
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          transition={{ layout: { duration: 0.25, type: 'spring' } }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: reducedMotion ? 0 : 0.35, delay: index * 0.04 }}
              >
                <ProjectCard
                  project={project}
                  onOpen={(selected) => {
                    trackEvent({
                      eventType: 'project_click',
                      projectId: selected.id,
                      projectAction: 'details',
                      page: 'projects-section',
                    });
                    setSelectedProject(selected);
                  }}
                  onTechExplore={setActiveTech}
                  githubStats={githubStatsMap[project.id]}
                  compared={compareIds.includes(project.id)}
                  onCompareToggle={handleCompareToggle}
                  onShare={handleShare}
                  onTrackProjectView={handleTrackProjectView}
                  onTrackProjectClick={handleTrackProjectClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onTechExplore={(tech) => {
              setActiveTech(tech);
              setSelectedProject(null);
            }}
            onShare={handleShare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

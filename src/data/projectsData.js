export const PROJECT_CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack', 'Java'];

export const projects = [
  {
    id: 'agro-ecommerce-platform',
    title: 'GREENHARVEST-SOLUTIONS',
    description:
      'A full-stack marketplace that modernizes agricultural trading by connecting farmers, admins, and customers with centralized product, inventory, and order management.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'JWT'],
    github: 'https://github.com/HATAG-TECH/agro-ecommerce-platform',
    demo: 'https://example.com/demo/agro-ecommerce-platform',
    category: 'Full Stack',
    date: '2026-12-01',
    complexity: 5,
    difficulty: 5,
    screenshot:
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80',
    features: [
      {
        title: 'Role-Based Access',
        icon: 'RB',
        detail: 'JWT authentication with admin and farmer role permissions across protected APIs.',
      },
      {
        title: 'Product & Category Management',
        icon: 'PC',
        detail: 'Admins and farmers manage products, categories, and inventory through dashboard workflows.',
      },
      {
        title: 'Order Processing',
        icon: 'OP',
        detail: 'Customers place orders through secure checkout with tracked order lifecycle states.',
      },
    ],
    challenges: [
      {
        challenge: 'Balancing multi-role authorization with flexible API endpoints.',
        solution: 'Implemented centralized JWT middleware and role-aware route guards.',
      },
      {
        challenge: 'Maintaining consistency between inventory and order updates.',
        solution: 'Added transactional update flows and strict server-side validation.',
      },
    ],
    architecture: [
      { name: 'Frontend', role: 'React client for browsing, ordering, and dashboard operations' },
      { name: 'Backend', role: 'Node.js + Express REST API with modular services and controllers' },
      { name: 'Data Layer', role: 'Normalized PostgreSQL schema with MongoDB support for flexible metadata' },
    ],
    codeSnippets: [
      {
        label: 'JWT Guard',
        language: 'javascript',
        code: `export function requireRole(...roles) {\n  return (req, res, next) => {\n    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });\n    next();\n  };\n}`,
      },
      {
        label: 'Order Inventory Sync',
        language: 'javascript',
        code: `await db.tx(async (tx) => {\n  const product = await tx.one('SELECT stock FROM products WHERE id=$1 FOR UPDATE', [productId]);\n  if (product.stock < qty) throw new Error('Insufficient stock');\n  await tx.none('UPDATE products SET stock = stock - $1 WHERE id=$2', [qty, productId]);\n  await tx.none('INSERT INTO orders(user_id,total) VALUES($1,$2)', [userId, total]);\n});`,
      },
    ],
    metrics: [
      { label: 'Auth Coverage', value: 94 },
      { label: 'Order Success Rate', value: 89 },
      { label: 'Inventory Accuracy', value: 91 },
    ],
  },
  {
    id: 'crypto-tracker',
    title: 'Crypto Tracker',
    description:
      'A responsive dashboard tracking real-time cryptocurrency prices, market trends, and portfolio performance.',
    techStack: ['React', 'Tailwind CSS', 'WebSockets', 'Chart.js'],
    github: 'https://github.com/HATAG-TECH/crypto-tracker',
    demo: 'https://example.com/demo/crypto-tracker',
    category: 'Frontend',
    date: '2025-11-10',
    complexity: 3,
    difficulty: 3,
    screenshot:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    features: [
      { title: 'Live Price Stream', icon: 'WS', detail: 'Push updates over websocket channels.' },
      { title: 'Interactive Charts', icon: 'CH', detail: 'Zoom and compare asset trends quickly.' },
      { title: 'Portfolio Sandbox', icon: 'PF', detail: 'Track simulated gains and losses.' },
    ],
    challenges: [
      {
        challenge: 'Noisy live feeds caused chart jitter.',
        solution: 'Added throttling and adaptive data windowing before rendering.',
      },
      {
        challenge: 'High-frequency updates increased paint cost.',
        solution: 'Memoized chart config and batched updates in 500ms windows.',
      },
    ],
    architecture: [
      { name: 'UI Layer', role: 'React + Tailwind components' },
      { name: 'Realtime Layer', role: 'WebSocket stream processing' },
      { name: 'Visualization Layer', role: 'Chart.js with derived metrics' },
    ],
    codeSnippets: [
      {
        label: 'Socket Hook',
        language: 'javascript',
        code: `useEffect(() => {\n  const socket = new WebSocket(streamUrl);\n  socket.onmessage = (event) => enqueue(JSON.parse(event.data));\n  return () => socket.close();\n}, [streamUrl]);`,
      },
      {
        label: 'Chart Optimizer',
        language: 'javascript',
        code: `const dataset = useMemo(() => normalizePricePoints(points), [points]);\nreturn <Line data={dataset} options={chartOptions} />;`,
      },
    ],
    metrics: [
      { label: 'Lighthouse Perf', value: 92 },
      { label: 'Bundle Size', value: 78 },
      { label: 'API Latency', value: 68 },
    ],
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management System',
    description: 'Stock control platform for tracking inventory, suppliers, purchases, and sales.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/HATAG-TECH/inventory-management-system',
    demo: 'https://example.com/demo/inventory-management',
    category: 'Backend',
    date: '2025-09-16',
    complexity: 4,
    difficulty: 4,
    screenshot:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    features: [
      { title: 'Inventory Ledger', icon: 'IL', detail: 'Track movement by product and location.' },
      { title: 'Supplier Management', icon: 'SM', detail: 'Store contacts, lead times, and terms.' },
      { title: 'Role Controls', icon: 'RB', detail: 'Separate admin and operator capabilities.' },
    ],
    challenges: [
      {
        challenge: 'Multiple edits caused stock inconsistencies.',
        solution: 'Applied transaction-safe updates with conflict checks.',
      },
      {
        challenge: 'Large product catalog slowed list rendering.',
        solution: 'Implemented indexed queries with paginated endpoints.',
      },
    ],
    architecture: [
      { name: 'API Layer', role: 'Express REST endpoints' },
      { name: 'Domain Layer', role: 'Inventory and supplier services' },
      { name: 'Data Layer', role: 'MongoDB models with indexing' },
    ],
    codeSnippets: [
      {
        label: 'Stock Transaction',
        language: 'javascript',
        code: `await session.withTransaction(async () => {\n  const item = await Item.findById(itemId).session(session);\n  item.stock = item.stock + delta;\n  await item.save({ session });\n});`,
      },
      {
        label: 'Filter API',
        language: 'javascript',
        code: `router.get('/items', async (req, res) => {\n  const query = buildItemQuery(req.query);\n  const items = await Item.find(query).limit(30).sort({ updatedAt: -1 });\n  res.json(items);\n});`,
      },
    ],
    metrics: [
      { label: 'API Success Rate', value: 95 },
      { label: 'Avg Query Speed', value: 82 },
      { label: 'Test Coverage', value: 71 },
    ],
  },
  {
    id: 'helpdesk-queue',
    title: 'Helpdesk Ticket Queue System',
    description:
      'Ticketing platform that manages support requests with priority queueing and agent assignment.',
    techStack: ['React', 'Node.js', 'Socket.io'],
    github: 'https://github.com/HATAG-TECH/helpdesk-queue-system',
    demo: 'https://example.com/demo/helpdesk-queue',
    category: 'Full Stack',
    date: '2025-12-03',
    complexity: 4,
    difficulty: 4,
    screenshot:
      'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80',
    features: [
      { title: 'Priority Queue', icon: 'PQ', detail: 'Urgent tickets always rise to top.' },
      { title: 'Realtime Board', icon: 'RT', detail: 'Agents see instant status updates.' },
      { title: 'SLA Tracker', icon: 'SL', detail: 'Visual timers for response commitments.' },
    ],
    challenges: [
      {
        challenge: 'Race conditions during ticket assignment.',
        solution: 'Used optimistic lock versioning and assignment checks.',
      },
      {
        challenge: 'Realtime events flooded clients.',
        solution: 'Scoped channels by team and debounced event broadcasts.',
      },
    ],
    architecture: [
      { name: 'Frontend', role: 'React dashboard + ticket board' },
      { name: 'Realtime', role: 'Socket.io event broker' },
      { name: 'Backend', role: 'Express API + persistence services' },
    ],
    codeSnippets: [
      {
        label: 'Priority Queue',
        language: 'javascript',
        code: `const nextTicket = queue.sort((a, b) => b.priority - a.priority)[0];\nassignTicket(nextTicket, agentId);`,
      },
      {
        label: 'Socket Broadcast',
        language: 'javascript',
        code: `io.to(teamId).emit('ticket:update', {\n  id: ticket.id,\n  status: ticket.status,\n  assignee: ticket.assignee,\n});`,
      },
    ],
    metrics: [
      { label: 'Realtime Sync', value: 89 },
      { label: 'SLA Compliance', value: 83 },
      { label: 'First Response Time', value: 76 },
    ],
  },
  {
    id: 'task-management',
    title: 'Task Management System',
    description:
      'Kanban-style task manager with drag-and-drop workflows and team collaboration features.',
    techStack: ['React', 'Express', 'MongoDB', 'DnD Kit'],
    github: 'https://github.com/HATAG-TECH/task-management-system',
    demo: 'https://example.com/demo/task-management',
    category: 'Full Stack',
    date: '2025-08-22',
    complexity: 3,
    difficulty: 3,
    screenshot:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    features: [
      { title: 'Kanban Workflow', icon: 'KB', detail: 'Drag tasks between progress states.' },
      { title: 'Labels & Dates', icon: 'LD', detail: 'Prioritize tasks with visual markers.' },
      { title: 'Team Boards', icon: 'TB', detail: 'Separate workspaces for each project.' },
    ],
    challenges: [
      {
        challenge: 'Drag interactions felt laggy on low-end devices.',
        solution: 'Reduced re-renders by splitting card and board state.',
      },
      {
        challenge: 'Board permissions became hard to manage.',
        solution: 'Centralized role checks in middleware and policy helpers.',
      },
    ],
    architecture: [
      { name: 'UI Board', role: 'DnD Kit board and cards' },
      { name: 'API', role: 'Task CRUD and board membership endpoints' },
      { name: 'Storage', role: 'Mongo collections for boards and tasks' },
    ],
    codeSnippets: [
      {
        label: 'DnD Handler',
        language: 'javascript',
        code: `function onDragEnd(event) {\n  const { active, over } = event;\n  if (!over) return;\n  moveTask(active.id, over.id);\n}`,
      },
      {
        label: 'Board Policy',
        language: 'javascript',
        code: `if (!board.members.includes(userId)) {\n  return res.status(403).json({ error: 'Unauthorized board access' });\n}`,
      },
    ],
    metrics: [
      { label: 'Interaction Smoothness', value: 84 },
      { label: 'Task API Reliability', value: 90 },
      { label: 'Board Load Speed', value: 79 },
    ],
  },
  {
    id: 'bug-tracker',
    title: 'Bug Tracking System',
    description: 'Issue tracker to report, assign, and resolve software bugs for small teams.',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
    github: 'https://github.com/HATAG-TECH/bug-tracking-system',
    demo: 'https://example.com/demo/bug-tracker',
    category: 'Backend',
    date: '2025-07-14',
    complexity: 3,
    difficulty: 3,
    screenshot:
      'https://images.unsplash.com/photo-1517142089942-ba376ce32a0f?auto=format&fit=crop&w=1200&q=80',
    features: [
      { title: 'Issue Lifecycle', icon: 'LC', detail: 'Open, in-progress, and resolved flow.' },
      { title: 'Severity Tracking', icon: 'SV', detail: 'Prioritize bugs by impact and urgency.' },
      { title: 'Assignee Filters', icon: 'AF', detail: 'Quickly find owner-specific issues.' },
    ],
    challenges: [
      {
        challenge: 'Status transitions were inconsistent.',
        solution: 'Implemented explicit workflow transition map in backend.',
      },
      {
        challenge: 'Filtering large issue lists felt slow.',
        solution: 'Added server-side filtering and relevant DB indexes.',
      },
    ],
    architecture: [
      { name: 'Frontend Views', role: 'Issue list + detail forms' },
      { name: 'Workflow API', role: 'Transition and assignment endpoints' },
      { name: 'Persistence', role: 'Indexed bug and project collections' },
    ],
    codeSnippets: [
      {
        label: 'Workflow Guard',
        language: 'javascript',
        code: `const allowed = transitions[currentStatus] || [];\nif (!allowed.includes(nextStatus)) throw new Error('Invalid transition');`,
      },
      {
        label: 'Query Builder',
        language: 'javascript',
        code: `const query = {\n  ...(status && { status }),\n  ...(assignee && { assignee }),\n  ...(severity && { severity }),\n};`,
      },
    ],
    metrics: [
      { label: 'Workflow Accuracy', value: 88 },
      { label: 'Filter Response', value: 81 },
      { label: 'Resolved Bug Rate', value: 72 },
    ],
  },
  {
    id: 'job-portal',
    title: 'Job Portal System (Java Full Stack)',
    description: 'Java full stack portal for job seekers, employers, and platform administrators.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'XAMPP'],
    github: 'https://github.com/HATAG-TECH/job-portal-system',
    demo: 'https://example.com/demo/job-portal',
    category: 'Java',
    date: '2026-01-19',
    complexity: 5,
    difficulty: 5,
    screenshot:
      '/admin.jpg',
    features: [
      { title: 'Multi-Role Access', icon: 'RA', detail: 'Distinct flows for seekers, employers, admins.' },
      { title: 'Application Pipeline', icon: 'AP', detail: 'Track candidate stages and recruiter actions.' },
      { title: 'Moderation Tools', icon: 'MT', detail: 'Admins review job listings and reports.' },
    ],
    challenges: [
      {
        challenge: 'Complex relational schema increased query complexity.',
        solution: 'Normalized schema and optimized high-traffic joins.',
      },
      {
        challenge: 'Role permissions became difficult to audit.',
        solution: 'Introduced centralized role matrix and endpoint guards.',
      },
    ],
    architecture: [
      { name: 'Presentation', role: 'Server-rendered and API-driven UI' },
      { name: 'Service Layer', role: 'Spring Boot domain services' },
      { name: 'Data Layer', role: 'MySQL relational model with indexes' },
    ],
    codeSnippets: [
      {
        label: 'Role Guard',
        language: 'java',
        code: `@PreAuthorize("hasAnyRole('ADMIN','EMPLOYER')")\n@PostMapping("/jobs")\npublic ResponseEntity<JobDto> createJob(@RequestBody JobDto payload) {\n  return ResponseEntity.ok(jobService.create(payload));\n}`,
      },
      {
        label: 'Repository Query',
        language: 'java',
        code: `@Query("SELECT a FROM Application a WHERE a.job.id = :jobId ORDER BY a.createdAt DESC")\nList<Application> findByJob(@Param("jobId") Long jobId);`,
      },
    ],
    metrics: [
      { label: 'Endpoint Throughput', value: 87 },
      { label: 'Query Efficiency', value: 80 },
      { label: 'Auth Coverage', value: 93 },
    ],
  },
];


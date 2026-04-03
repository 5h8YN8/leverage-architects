/**
 * Human in the Loop Talent - AI-Era Hiring Diagnostic Scoring Engine
 *
 * Comprehensive assessment module that generates organizational diagnostic insights
 * based on survey responses about AI readiness, team structure, and hiring needs.
 */

/**
 * Score AI Readiness (1-5)
 * Based on: ai_usage_level, ai_helping_where, open_to_ai_first
 *
 * @param {Object} responses - Survey responses
 * @returns {number} Score 1-5
 */
function scoreAiReadiness(responses) {
  const usage = responses.ai_usage_level || 'none';
  const helpingWhere = responses.ai_helping_where || '';
  const openToAiFirst = responses.open_to_ai_first === 'yes';

  // none usage + not open = 1
  if (usage === 'none' && !openToAiFirst) {
    return 1;
  }

  // informal + open = 2
  if (usage === 'informal' && openToAiFirst) {
    return 2;
  }

  // team_level = 3
  if (usage === 'team_level') {
    return 3;
  }

  // company_wide = 4-5 depending on breadth
  if (usage === 'company_wide') {
    // Check if AI is helping in multiple areas (higher richness = higher score)
    const areas = (helpingWhere || '').split(',').filter(Boolean).length;
    return areas >= 3 ? 5 : 4;
  }

  // informal without full openness = 2
  if (usage === 'informal') {
    return 2;
  }

  return 1;
}

/**
 * Score Role Clarity (1-5)
 * Based on ownership distribution and bottlenecks
 *
 * @param {Object} responses - Survey responses
 * @returns {number} Score 1-5
 */
function scoreRoleClarity(responses) {
  const ownsRoadmap = responses.owns_roadmap || 'unclear';
  const ownsGrowth = responses.owns_growth || 'unclear';
  const ownsAi = responses.owns_ai || 'unclear';

  // Collect all owners
  const owners = [ownsRoadmap, ownsGrowth, ownsAi].filter((o) => o !== 'no one' && o !== 'unclear');

  // If all unclear or "no one" = 1
  const unclearCount = [ownsRoadmap, ownsGrowth, ownsAi].filter((o) => o === 'unclear' || o === 'no one').length;
  if (unclearCount >= 2) {
    return 1;
  }

  // If same person owns all = 2 (bottleneck risk)
  const uniqueOwners = new Set(owners);
  if (uniqueOwners.size === 1 && owners.length === 3) {
    return 2;
  }

  // If 2 distinct owners = 3
  if (uniqueOwners.size === 2) {
    return 3;
  }

  // If 3 distinct owners (perfect clarity) = 5
  if (uniqueOwners.size === 3) {
    return 5;
  }

  // Check for bottleneck signals
  const hasBottleneck =
    responses.bottleneck_1 === 'unclear_ownership' ||
    responses.bottleneck_2 === 'unclear_ownership' ||
    responses.bottleneck_3 === 'unclear_ownership';

  return hasBottleneck ? 2 : 3;
}

/**
 * Map bottleneck to severity value (before normalization)
 *
 * @param {string} bottleneck - Bottleneck type
 * @returns {number} Severity value
 */
function getBottleneckSeverity(bottleneck) {
  const highSeverity = ['founder_dependency', 'slow_shipping', 'unclear_ownership'];
  const mediumSeverity = ['weak_growth_engine', 'poor_analytics'];
  const moderateSeverity = ['too_many_specialists', 'no_ai_capacity', 'bloated_coordination', 'hiring_wrong_profiles'];

  if (highSeverity.includes(bottleneck)) return 5;
  if (mediumSeverity.includes(bottleneck)) return 3;
  if (moderateSeverity.includes(bottleneck)) return 2;

  return 2; // Default
}

/**
 * Score Execution Bottleneck Severity (1-5)
 * Weighted by bottleneck ranking: 3x, 2x, 1x
 *
 * @param {Object} responses - Survey responses
 * @returns {number} Score 1-5
 */
function scoreExecutionBottleneckSeverity(responses) {
  const bottleneck1 = responses.bottleneck_1 || 'none';
  const bottleneck2 = responses.bottleneck_2 || 'none';
  const bottleneck3 = responses.bottleneck_3 || 'none';

  const severity1 = getBottleneckSeverity(bottleneck1) * 3;
  const severity2 = getBottleneckSeverity(bottleneck2) * 2;
  const severity3 = getBottleneckSeverity(bottleneck3) * 1;

  const totalWeight = (bottleneck1 !== 'none' ? 3 : 0) + (bottleneck2 !== 'none' ? 2 : 0) + (bottleneck3 !== 'none' ? 1 : 0);

  if (totalWeight === 0) {
    return 2; // Low baseline if no bottlenecks reported
  }

  const weightedAverage = (severity1 + severity2 + severity3) / totalWeight;

  // Normalize to 1-5 scale
  return Math.round(Math.max(1, Math.min(5, weightedAverage)));
}

/**
 * Score Leverage Opportunity (1-5)
 * High opportunity = low AI readiness + high headcount + cost/AI objectives
 *
 * @param {Object} responses - Survey responses
 * @param {number} aiReadiness - AI readiness score
 * @returns {number} Score 1-5
 */
function scoreLeverageOpportunity(responses, aiReadiness) {
  let score = 3; // Base

  // Inverted AI readiness (low AI = high opportunity)
  if (aiReadiness <= 2) {
    score += 1.5;
  } else if (aiReadiness >= 4) {
    score -= 1;
  }

  // Headcount
  const headcount = parseInt(responses.headcount || '0', 10);
  if (headcount >= 20) {
    score += 1;
  } else if (headcount <= 5) {
    score -= 1;
  }

  // Stage
  const stage = responses.stage || 'seed';
  if (['pre_seed', 'seed'].includes(stage)) {
    score -= 0.5;
  } else if (['series_b', 'series_c', 'post_growth'].includes(stage)) {
    score += 0.5;
  }

  // Objectives aligned with leverage
  const objective = responses.primary_objective || '';
  if (['reduce_costs', 'add_ai_features', 'improve_conversion_growth'].includes(objective)) {
    score += 0.5;
  }

  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * Score Hiring Urgency (1-5)
 * Based on: hiring_urgency field, hiring_budget, stage, need_recruiting
 *
 * @param {Object} responses - Survey responses
 * @returns {number} Score 1-5
 */
function scoreHiringUrgency(responses) {
  let score = 2; // Base

  // Hiring urgency preference
  const urgency = responses.hiring_urgency || 'no_rush';
  if (urgency === 'asap') {
    score += 2;
  } else if (urgency === 'next_quarter') {
    score += 1;
  }

  // Budget
  const budget = responses.hiring_budget || 'low';
  if (budget === 'high') {
    score += 1;
  } else if (budget === 'low') {
    score -= 0.5;
  }

  // Stage
  const stage = responses.stage || 'seed';
  if (['series_a', 'series_b', 'series_c'].includes(stage)) {
    score += 0.5;
  }

  // Need recruiting
  if (responses.need_recruiting === 'yes') {
    score += 0.5;
  }

  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * Determine Team Archetype based on strongest signals
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @returns {string} Archetype name
 */
function determineArchetype(responses, scores) {
  const stage = responses.stage || 'seed';
  const headcount = parseInt(responses.headcount || '0', 10);
  const objective = responses.primary_objective || '';
  const opsCount = parseInt(responses.team_ops_support || responses.ops_support_count || '0', 10);

  // operations-heavy but under-automated team — check FIRST
  // If ops/support > 30% of headcount AND ai_readiness <= 2
  if (opsCount > headcount * 0.3 && scores.ai_readiness <= 2) {
    return 'operations-heavy but under-automated team';
  }

  // specialist-bloated team - check bottlenecks before objectives
  if (responses.bottleneck_1 === 'too_many_specialists' || responses.bottleneck_2 === 'too_many_specialists') {
    return 'specialist-bloated team';
  }

  // founder-led scrappy builder team
  if ((stage === 'pre_seed' || stage === 'seed') && headcount <= 10) {
    if (responses.bottleneck_1 === 'founder_dependency' || responses.bottleneck_2 === 'founder_dependency') {
      return 'founder-led scrappy builder team';
    }
  }

  // growth-constrained team - requires specific bottleneck + objective alignment
  if (objective === 'improve_conversion_growth' && responses.bottleneck_1 === 'weak_growth_engine') {
    return 'growth-constrained team';
  }

  // AI-transition team
  if (objective === 'add_ai_features' && (scores.ai_readiness === 3 || scores.ai_readiness === 4)) {
    return 'AI-transition team';
  }

  // product-heavy shipping team
  if (objective === 'ship_product_faster') {
    return 'product-heavy shipping team';
  }

  // Default to most common archetype based on stage
  if (stage === 'series_a' || stage === 'series_b') {
    return 'product-heavy shipping team';
  }

  return 'founder-led scrappy builder team';
}

/**
 * Determine Hiring Posture
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @returns {string} Hiring posture statement
 */
function determineHiringPosture(responses, scores) {
  const aiReadiness = scores.ai_readiness;
  const leverage = scores.leverage_opportunity;
  const urgency = scores.hiring_urgency;
  const stage = responses.stage || 'seed';

  // "do not hire yet; redesign workflow first"
  if (aiReadiness >= 1 && aiReadiness <= 2 && leverage >= 4) {
    return 'do not hire yet; redesign workflow first';
  }

  // "build internal AI ops before adding headcount"
  if (aiReadiness <= 2 && responses.open_to_ai_first === 'yes') {
    return 'build internal AI ops before adding headcount';
  }

  // "use fractional talent first"
  if (responses.open_to_fractional === 'yes') {
    const budget = responses.hiring_budget || 'low';
    if (budget !== 'high') {
      return 'use fractional talent first';
    }
  }

  // "make two foundational hires"
  if ((stage === 'series_a' || stage === 'series_b') && urgency >= 3) {
    return 'make two foundational hires';
  }

  // "make one leverage hire"
  if (urgency >= 2 && urgency <= 3) {
    return 'make one leverage hire';
  }

  return 'make one leverage hire'; // Default
}

/**
 * Map bottlenecks and objectives to recommended roles
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @returns {Array} Array of role objects with leverage rankings
 */
function generateRecommendedRoles(responses, scores) {
  const bottleneck1 = responses.bottleneck_1 || '';
  const bottleneck2 = responses.bottleneck_2 || '';
  const bottleneck3 = responses.bottleneck_3 || '';
  const objective = responses.primary_objective || '';
  const stage = responses.stage || 'seed';
  const headcount = parseInt(responses.headcount || '0', 10);
  const aiUsageLevel = responses.ai_usage_level || 'none';
  const needRecruiting = responses.need_recruiting || 'no';

  const roleMap = {
    slow_shipping: {
      title: 'Senior Full-Stack Engineer (AI-fluent)',
      why_now: 'Shipping velocity is your primary constraint. AI-fluent engineers can use code generation and automation to cut development time in half. This isn\'t about adding another pair of hands — it\'s about introducing a force multiplier who changes how your entire engineering team ships.',
      problem_it_solves: 'Eliminates slow_shipping bottleneck; reduces cycle time from weeks to days',
      strategic_rationale: 'AI-fluent engineers command a 15-25% premium over traditional full-stack engineers, but they compress timelines by 2-3x. The ROI inflection point is typically week 6, when AI-assisted workflows start propagating across the team. This is a leverage hire, not a capacity hire.',
      ninety_day_outcomes: [
        'AI-assisted development workflow established across entire codebase (Copilot, Cursor, or equivalent)',
        'Deployment frequency increased 3x; PR-to-merge cycle reduced from days to hours',
        'Mentors 2-3 existing engineers on AI-native development practices',
        'First internal AI tooling demo (e.g., automated test generation, code review assist)',
      ],
      person_to_avoid: 'Senior engineer who insists on "traditional" TDD without AI augmentation; productivity-focused IC who won\'t mentor; anyone who treats AI tooling as a shortcut rather than a workflow transformation',
      interview_signals: ['Ask them to pair-program with AI tools live — not just talk about it', 'Look for someone who has opinions about prompt engineering for code, not just coding itself', 'Red flag: they dismiss AI-assisted development as "cheating" or "not real engineering"'],
      compensation: {
        base_range: { low: 175000, high: 250000 },
        total_comp_range: { low: 200000, high: 320000 },
        equity_range: '0.05% - 0.25%',
        notes: 'AI-fluent engineers command a 15-25% premium over traditional full-stack. Expect $230K-$320K total comp in major metro areas. Remote-first companies can save 15-20% by hiring outside SF/NYC.',
        market_reality: 'This role is in extremely high demand. Expect 2-4 weeks to close a strong candidate. Lowballing on cash will lose you to FAANG or well-funded Series B+ companies every time.',
      },
      leverage_score: 5,
      time_to_impact: 5,
      cost_efficiency: 4,
    },
    weak_growth_engine: {
      title: 'Growth Lead / Demand Gen Manager',
      why_now: 'You have product-market fit signals but no repeatable acquisition machine. Every dollar of growth is currently ad-hoc. A growth lead builds the playbooks, metrics, and channels that turn one-off wins into compounding revenue.',
      problem_it_solves: 'Transforms weak_growth_engine bottleneck into measurable acquisition funnel',
      strategic_rationale: 'Most companies at your stage confuse marketing activity with a growth engine. A growth lead is not a content marketer — they\'re a systems builder who thinks in funnels, experiments, and payback periods. The gap between "we do some marketing" and "we have a growth engine" is the difference between linear and exponential revenue.',
      ninety_day_outcomes: [
        'First repeatable growth channel identified, tested, and optimized (CAC validated)',
        'Lead generation automation implemented with scoring model',
        'Dashboard showing CAC, LTV, payback period, and channel attribution live',
        'Growth experimentation framework running: minimum 3 experiments per sprint',
      ],
      person_to_avoid: 'Marketing generalist who thinks in campaigns not funnels; "brand" marketer at a growth-stage company; anyone who can\'t build their own landing pages or run SQL queries on conversion data',
      interview_signals: ['Ask them to whiteboard your funnel live and identify the biggest leak', 'Look for someone who speaks in unit economics, not impressions', 'Red flag: they want to "build brand awareness" before measuring conversion'],
      compensation: {
        base_range: { low: 130000, high: 180000 },
        total_comp_range: { low: 150000, high: 220000 },
        equity_range: '0.05% - 0.2%',
        notes: 'Growth leads with proven startup traction (not just big-company experience) command $150K-$220K total comp. Expect higher for candidates who have built a growth function from scratch.',
        market_reality: 'True growth leads (not rebranded marketing managers) are rare. The best ones have 2-3 case studies of building a channel from $0 to $1M+ ARR. Budget for performance bonuses tied to pipeline targets.',
      },
      leverage_score: 5,
      time_to_impact: 4,
      cost_efficiency: 4,
    },
    founder_dependency: {
      title: 'Chief of Staff / Operations Lead',
      why_now: 'The founder bottleneck is the most expensive problem in your company right now — it just doesn\'t show up on a P&L. Every decision that routes through one person creates invisible queue time. A CoS/Ops lead doesn\'t just "help the founder" — they build the operating system that makes the founder optional for 80% of decisions.',
      problem_it_solves: 'Removes founder_dependency bottleneck; scales decision-making capacity',
      strategic_rationale: 'Founder dependency is the #1 bottleneck we see in companies between 8 and 40 people. The founder knows this but can\'t fix it alone because fixing it requires the same bandwidth they don\'t have. A Chief of Staff breaks this loop by becoming the "second brain" — absorbing context, building systems, and making the founder\'s time 3x more valuable.',
      ninety_day_outcomes: [
        'Weekly operating rhythms and decision-tracking dashboards established',
        'Delegation framework live: founder time on operational tasks reduced 40%+',
        'Cross-functional priority alignment: teams know what matters without asking founder',
        'Board/investor prep systematized; founder spends time on strategy, not slide-making',
      ],
      person_to_avoid: 'Pure administrator who waits for instructions; someone who needs a job description to act; ex-consultant who can diagnose but not execute; anyone who adds process without removing friction',
      interview_signals: ['Give them a real operational mess from last month and see how they triage', 'Best CoS candidates will ask about your decision-making bottlenecks within 5 minutes', 'Red flag: they describe their value as "keeping things organized" instead of "making you faster"'],
      compensation: {
        base_range: { low: 120000, high: 175000 },
        total_comp_range: { low: 140000, high: 240000 },
        equity_range: '0.1% - 0.4%',
        notes: 'CoS compensation varies wildly by stage. Seed: $93K-$175K base + meaningful equity (0.1-2.0%). Series A: $140K-$240K total comp. SF/NYC command 30-50% premium. The best CoS candidates often take below-market cash for above-market equity + scope.',
        market_reality: 'This is one of the few roles where equity-heavy packages actually work — top CoS candidates are betting on the company, not optimizing for cash. But don\'t confuse "open to equity" with "willing to be underpaid." Below $120K base at Series A signals you don\'t value the role.',
      },
      leverage_score: 4,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
    no_ai_capacity: {
      title: 'AI/ML Engineer or AI Ops Lead',
      why_now: 'You want AI in your product and operations but lack internal expertise. Every month without an AI ops lead is a month your competitors are compounding their AI advantage. This role doesn\'t just build features — it builds the infrastructure that makes every future AI initiative 10x faster.',
      problem_it_solves: 'Unblocks add_ai_features objective; builds AI ops infrastructure that the entire company uses',
      strategic_rationale: 'The AI talent market has bifurcated: research scientists ($300K+) and applied AI engineers ($180K-$250K). You need the latter — someone who can ship AI-powered features in weeks, not publish papers in months. The most valuable AI hires right now are "AI ops" generalists who can integrate APIs, build internal tools, and train your team, not specialists who need a team of their own.',
      ninety_day_outcomes: [
        'Internal AI ops playbook created: prompt management, API integration standards, cost monitoring',
        'First 2-3 AI-powered features live in product (not prototypes — production)',
        'Team trained on AI-native development; 3+ engineers using AI tools daily',
        'AI cost model established: per-query costs, caching strategy, vendor evaluation complete',
      ],
      person_to_avoid: 'PhD researcher focused on novel algorithms who needs 6 months before shipping anything; ML engineer who only works in Jupyter notebooks; anyone who can\'t explain AI tradeoffs to non-technical stakeholders',
      interview_signals: ['Ask them to architect an AI feature for your product in 30 minutes — whiteboard, not slides', 'Look for someone who talks about cost per query, latency, and caching — not just model accuracy', 'Red flag: they want to "build a custom model" before trying off-the-shelf APIs'],
      compensation: {
        base_range: { low: 160000, high: 230000 },
        total_comp_range: { low: 185000, high: 300000 },
        equity_range: '0.05% - 0.3%',
        notes: 'Applied AI/ML engineers: $185K-$300K total comp depending on seniority and location. AI Ops leads (more generalist, less research) are slightly lower: $160K-$250K. The premium over traditional backend engineers is 20-35%.',
        market_reality: 'This is the single hottest role in the market right now. Expect 30-50 days to close. Candidates with production AI experience (not just Kaggle competitions) are fielding 5-10 offers simultaneously. You will not win this hire at below-market cash — equity alone doesn\'t close AI talent unless you\'re a rocketship.',
      },
      leverage_score: 4,
      time_to_impact: 4,
      cost_efficiency: 3,
    },
    poor_analytics: {
      title: 'Data Analyst / Analytics Engineer',
      why_now: 'You\'re making million-dollar decisions on gut instinct. A data analyst doesn\'t just build dashboards — they create the feedback loops that make every other function in your company measurably better. Without analytics, your growth experiments are guesses, your product roadmap is opinion-driven, and your hiring plan is a wish list.',
      problem_it_solves: 'Replaces poor_analytics bottleneck with self-serve BI and data-driven decision culture',
      strategic_rationale: 'Analytics is the cheapest high-leverage hire on this list. A single strong analyst paying $90K-$130K can save you from a $500K hiring mistake by showing you which bottlenecks are real and which are perceived. They also make every other hire more effective by giving them data to act on.',
      ninety_day_outcomes: [
        'North-star metric dashboard live and updated daily (not weekly, not monthly)',
        'Self-serve SQL/Looker/Metabase access for product and growth teams',
        'Weekly metrics deep-dives becoming team habit; anomaly detection alerts active',
        'First data-informed decision that contradicts a previous assumption (this always happens)',
      ],
      person_to_avoid: 'Report writer without analytical curiosity; someone who waits for stakeholders to tell them what to analyze; anyone who can\'t write production SQL or set up a dashboard from scratch',
      interview_signals: ['Give them a messy dataset and 30 minutes — the best analysts will find something surprising', 'Look for someone who asks "what decision will this inform?" before building anything', 'Red flag: they describe their job as "making reports" instead of "finding insights"'],
      compensation: {
        base_range: { low: 85000, high: 135000 },
        total_comp_range: { low: 90000, high: 150000 },
        equity_range: '0.01% - 0.1%',
        notes: 'Data analysts: $85K-$135K base. Analytics engineers (dbt, data modeling): $120K-$165K. Senior/staff level in major metros: up to $180K total comp. This is one of the best ROI hires you can make — high impact, reasonable cost.',
        market_reality: 'Good news: this role is easier to fill than engineering or AI roles. Median time to close is 20-30 days. Bad news: the gap between a mediocre analyst and a great one is enormous. Screen for curiosity and SQL fluency, not tool familiarity.',
      },
      leverage_score: 3,
      time_to_impact: 3,
      cost_efficiency: 4,
    },
    unclear_ownership: {
      title: 'VP Engineering or Product Lead',
      why_now: 'Unclear ownership of key initiatives creates friction that compounds daily. When nobody owns the roadmap, everybody owns the roadmap — which means nobody is accountable for outcomes. A VP/Lead doesn\'t just "manage" — they create the clarity that lets everyone else move faster.',
      problem_it_solves: 'Resolves unclear_ownership bottleneck; creates single-threaded ownership of roadmap and AI strategy',
      strategic_rationale: 'At your stage, unclear ownership costs more than any bad hire. Every week without clear ownership of roadmap, growth, and AI strategy is a week where your team is optimizing locally instead of globally. This role is expensive — $250K-$350K+ total comp — but the cost of not having it is 3-6 months of drift.',
      ninety_day_outcomes: [
        'Roadmap ownership clarity: single-threaded owner for product, growth, and AI initiatives',
        'Quarterly OKRs defined with explicit owner assignments and success criteria',
        'Engineering hiring plan and AI adoption roadmap complete and board-ready',
        'First cross-functional planning cycle completed; team alignment measurably improved',
      ],
      person_to_avoid: 'Micromanager who needs to approve every PR; someone uncomfortable with ambiguity who demands perfect information before deciding; "big company" VP who needs a team of 50 to be effective',
      interview_signals: ['Ask them to describe how they\'d structure ownership in your org with 48 hours notice', 'Look for someone who has operated at your scale before, not just managed at your scale', 'Red flag: they want to "assess" for 90 days before making changes'],
      compensation: {
        base_range: { low: 200000, high: 300000 },
        total_comp_range: { low: 250000, high: 400000 },
        equity_range: '0.2% - 0.8%',
        notes: 'VP Eng at Series A: $250K-$300K base + $1M equity (4yr vest) = ~$500K total comp. Series B: $280K-$350K base. Product leads slightly lower on base but similar total comp with bonus. SF/NYC add 15-20%.',
        market_reality: 'This is the role founders most often underpay for. A VP Eng at Series A expects $250K+ base — offering $180K + "generous equity" signals you don\'t understand the market. The candidates who accept below-market are usually the ones who couldn\'t get market-rate offers elsewhere.',
      },
      leverage_score: 4,
      time_to_impact: 2,
      cost_efficiency: 2,
    },
    too_many_specialists: {
      title: 'Head of Operations (player-coach)',
      why_now: 'Too many specialists create silos and handoff delays. You don\'t need another specialist — you need a generalist who can see across boundaries and unify teams around shared workflows. A player-coach reduces coordination cost while personally closing execution gaps.',
      problem_it_solves: 'Simplifies bloated coordination; reduces handoffs and specialist silos',
      strategic_rationale: 'Specialist-heavy teams are expensive and slow. Each handoff between specialists adds 1-3 days of latency and context loss. A Head of Ops who can both manage cross-functional workflows and personally execute eliminates the coordination tax that\'s hidden in your velocity metrics.',
      ninety_day_outcomes: [
        'Cross-functional workflow automation 50% complete; handoff points documented and reduced',
        'Specialist roles evaluated: 1-2 consolidation opportunities identified',
        'Coordination meetings reduced 30%; async decision protocols established',
        'Operational dashboard showing cross-team dependencies and bottleneck trends',
      ],
      person_to_avoid: 'Pure manager with no hands-on capability; consultant who diagnoses without executing; process obsessive who creates more overhead than they eliminate',
      interview_signals: ['Ask them to map your current team\'s workflow on a whiteboard in 15 minutes', 'Look for someone who has personally eliminated a process, not just "improved" one', 'Red flag: they talk about "governance" and "frameworks" more than "shipping" and "unblocking"'],
      compensation: {
        base_range: { low: 140000, high: 200000 },
        total_comp_range: { low: 160000, high: 250000 },
        equity_range: '0.05% - 0.25%',
        notes: 'Head of Ops (player-coach): $140K-$200K base. Total comp $160K-$250K depending on stage and scope. This role is often more affordable than the VPs it replaces because the best candidates value scope and impact over title.',
        market_reality: 'Great ops leaders are undervalued by the market, which means you can often get exceptional talent at reasonable comp. The key is selling the scope — "you\'ll own how the entire company operates" is more compelling than a $20K base increase.',
      },
      leverage_score: 3,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
    bloated_coordination: {
      title: 'Head of Operations (player-coach)',
      why_now: 'Coordination overhead is eating into maker time across your entire team. When your engineers spend 30% of their time in meetings and status updates, you\'re paying engineering rates for project management work. A player-coach streamlines decision-making and gives your builders their time back.',
      problem_it_solves: 'Cuts bloated_coordination overhead; increases effective execution velocity by recovering lost maker time',
      strategic_rationale: 'The hidden cost of coordination overhead is staggering. If 10 engineers spend 30% of their time on coordination at $200K average comp, that\'s $600K/year in lost engineering productivity. A $180K Head of Ops who cuts that by half pays for themselves in month one.',
      ninety_day_outcomes: [
        'Decision log and async communication protocols live and adopted by all teams',
        'Meeting footprint reduced 25-40%; standing meetings audited and consolidated',
        'Team surveys show improved focus time and reduced context-switching',
        'Operational playbook for recurring cross-team workflows (launches, incidents, planning)',
      ],
      person_to_avoid: 'Process obsessive who creates more meetings to discuss reducing meetings; consultant mindset (diagnose, recommend, leave); anyone whose first instinct is to add a tool instead of remove a process',
      interview_signals: ['Ask them what meetings they\'d kill in their first week', 'Look for someone who has strong opinions about async vs sync work', 'Red flag: they describe success as "better alignment" instead of measurable outcomes'],
      compensation: {
        base_range: { low: 140000, high: 200000 },
        total_comp_range: { low: 160000, high: 250000 },
        equity_range: '0.05% - 0.25%',
        notes: 'Same range as ops player-coach above. The key differentiator is candidates who have specifically reduced coordination overhead at a similar-sized company.',
        market_reality: 'Look for ex-startup operators who have lived through the coordination bloat themselves. They\'ll be faster to impact than someone coming from a big company where coordination is "just how things work."',
      },
      leverage_score: 3,
      time_to_impact: 4,
      cost_efficiency: 4,
    },
    hiring_wrong_profiles: {
      title: 'Fractional Head of Talent',
      why_now: 'Hiring misalignment is compounding your bottlenecks. Every wrong hire costs 6-9 months of salary plus the opportunity cost of what a great hire would have delivered. A fractional talent lead fixes your hiring operating system — criteria, sourcing, evaluation — without the cost of a full-time executive.',
      problem_it_solves: 'Fixes hiring_wrong_profiles bottleneck; improves hiring hit rate from ~50% to 80%+',
      strategic_rationale: 'The math on bad hires is brutal: a $150K/year bad hire costs $225K-$400K when you factor in recruiting fees, onboarding, severance, and the 4-6 months of lost productivity. A fractional talent lead at $8K-$15K/month pays for themselves by preventing one bad hire per quarter.',
      ninety_day_outcomes: [
        'Updated job descriptions and hiring rubrics aligned to company stage and culture',
        'AI-native candidate sourcing pipeline active (not just LinkedIn recruiter spam)',
        'First 1-2 great hires placed through the new process with measurable fit criteria',
        'Hiring scorecard system: every interviewer evaluates against the same rubric',
      ],
      person_to_avoid: 'Recruiter focused only on speed and volume; someone without product/engineering context who can\'t evaluate technical candidates; agency recruiter rebranded as "fractional" — look for someone who redesigns the process, not just fills the pipeline',
      interview_signals: ['Ask them to critique your current JDs — the best ones will find 3-5 problems immediately', 'Look for someone who talks about "hiring systems" not "candidate pipelines"', 'Red flag: they start with "I have a great network" instead of "tell me about your last bad hire"'],
      compensation: {
        base_range: { low: 8000, high: 15000, note: 'per month (fractional)' },
        total_comp_range: { low: 96000, high: 180000, note: 'annualized' },
        equity_range: '0% - 0.05% (advisory)',
        notes: 'Fractional: $8K-$15K/month for 15-25 hours/week. Full-time equivalent would be $150K-$220K. The fractional model is ideal here because you don\'t need this role permanently — you need it to fix the system and train your team to maintain it.',
        market_reality: 'This is the most cost-effective hire on this list. The ROI is immediate and measurable. Most fractional talent leads work on 3-6 month engagements, which is exactly the right timeframe to rebuild a hiring process.',
      },
      leverage_score: 2,
      time_to_impact: 2,
      cost_efficiency: 5,
    },
    vp_engineering: {
      title: 'VP Engineering',
      why_now: 'You need strategic technical leadership to scale engineering, integrate AI across the stack, and build the team that builds the product. A VP Eng at your stage isn\'t a luxury — it\'s the difference between scaling intentionally and scaling chaotically.',
      problem_it_solves: 'Provides technical vision, team scaling framework, and AI integration strategy',
      strategic_rationale: 'Without a VP Eng, your CTO (or founder) is doing three jobs: architecture, people management, and strategic planning. That\'s unsustainable past 15 engineers. The VP Eng takes the people and process layer, freeing your technical founder to focus on product and architecture where they create the most value.',
      ninety_day_outcomes: [
        'Engineering org structure defined with clear career ladders and expectations',
        'AI integration roadmap established and first initiative underway',
        'First round of technical hiring planned with rubrics and pipeline',
        'Engineering velocity metrics established: cycle time, deployment frequency, incident rate',
      ],
      person_to_avoid: 'Hands-off manager who hasn\'t written code in 5 years; someone who needs a team of 50+ to be effective; "big company" VP who optimizes for process over velocity',
      interview_signals: ['Ask them how they\'d structure your eng team in 90 days — specifics, not principles', 'Look for someone who has scaled a team from your size to 2-3x your size', 'Red flag: they talk about "engineering excellence" without mentioning shipping speed'],
      compensation: {
        base_range: { low: 220000, high: 300000 },
        total_comp_range: { low: 280000, high: 500000 },
        equity_range: '0.4% - 1.0%',
        notes: 'Series A VP Eng: $250K-$300K base + equity valued at ~$1M (4yr vest). Series B: $280K-$350K base. Total comp (including equity) regularly exceeds $500K. Founder CTOs at Series A earn ~$177K; non-founder VPEs earn ~$293K — the premium reflects the difference between "building with equity upside" and "hired to execute."',
        market_reality: 'VP Eng candidates at Series A have 5-10 strong offers. The #1 reason they reject offers is "the founder doesn\'t actually want to give up control." If you\'re hiring a VP Eng, you need to be ready to delegate real authority — otherwise you\'ll get B-players who are comfortable being figureheads.',
      },
      leverage_score: 4,
      time_to_impact: 3,
      cost_efficiency: 2,
    },
    head_of_people: {
      title: 'Head of People',
      why_now: 'Rapid scaling without people infrastructure creates cultural debt that compounds faster than technical debt. A Head of People builds the systems that let you hire fast without breaking what makes your team work.',
      problem_it_solves: 'Enables rapid scaling with strong culture, consistent hiring, and people ops systems',
      strategic_rationale: 'Companies that scale from 20 to 60 people without a Head of People almost always experience a culture crisis around employee 40-50. By then, the original culture has diluted, processes are inconsistent, and your best early employees start leaving because "it doesn\'t feel the same." A Head of People prevents this by codifying culture before it dilutes.',
      ninety_day_outcomes: [
        'People operations infrastructure in place: HRIS, benefits administration, compliance',
        'Performance review system designed and first cycle completed',
        'Hiring process standardized: job descriptions, interview rubrics, offer templates',
        'Employee engagement baseline established; retention risk identified for key people',
      ],
      person_to_avoid: 'Overly administrative HR manager focused on compliance over culture; someone who thinks "people ops" means "planning happy hours"; anyone without experience scaling a team through a 2-3x growth phase',
      interview_signals: ['Ask them about a time they prevented a key employee from leaving — what did they see that others didn\'t?', 'Look for someone who can connect people strategy to business outcomes', 'Red flag: they lead with policy and compliance instead of culture and retention'],
      compensation: {
        base_range: { low: 150000, high: 220000 },
        total_comp_range: { low: 170000, high: 280000 },
        equity_range: '0.1% - 0.3%',
        notes: 'Head of People: $150K-$220K base at Series A/B. Higher if they\'ve scaled through a previous company\'s growth phase. Consider fractional ($10K-$15K/month) if headcount is under 30.',
        market_reality: 'This role is often deprioritized because founders don\'t feel the pain until it\'s acute. The best time to hire a Head of People is 6 months before you think you need one. By the time you feel the need, you\'re already losing institutional knowledge.',
      },
      leverage_score: 3,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
    technical_cofounder: {
      title: 'Technical Co-founder / CTO',
      why_now: 'At your stage, you need a technical leader who is building the product with their hands and setting the architectural foundation that everything else will be built on. This isn\'t a hire — it\'s a partnership. The wrong technical co-founder sets a ceiling on everything your company can become.',
      problem_it_solves: 'Provides technical execution, product leadership, and architectural vision from day one',
      strategic_rationale: 'Technical co-founders are not the same as hired CTOs. A co-founder takes below-market cash ($100K-$180K) for meaningful equity (2-10%) because they\'re betting on the company, not optimizing for compensation. If you\'re offering market-rate cash for this role, you\'re hiring a CTO, not finding a co-founder — and you should adjust your expectations accordingly.',
      ninety_day_outcomes: [
        'Core product architecture defined with clear scaling path',
        'First scalable features built and in users\' hands',
        'Technical roadmap established that aligns with business milestones',
        'Engineering culture and hiring bar established for first 3-5 engineering hires',
      ],
      person_to_avoid: 'Solo developer mindset who can\'t lead or communicate; architect who designs but doesn\'t ship; someone who treats this as a "job" rather than a mission — if they\'re negotiating hard on cash, they\'re probably not co-founder material',
      interview_signals: ['Spend 48 hours building something together before committing', 'Look for someone who challenges your product assumptions, not just agrees', 'Red flag: they want to "own the technical side" without understanding the business'],
      compensation: {
        base_range: { low: 100000, high: 180000 },
        total_comp_range: { low: 100000, high: 180000, note: 'cash, excluding equity' },
        equity_range: '2% - 10% (co-founder), 0.5% - 2% (hired CTO)',
        notes: 'Founder CTOs at Series A: ~$177K. Non-founder CTOs: ~$293K. The $116K gap is the "equity bet premium." If someone demands $250K+ cash to be your "co-founder," they\'re not a co-founder — they\'re a mercenary. That\'s fine, but price them as a hired CTO and set expectations accordingly.',
        market_reality: 'Finding a true technical co-founder is the hardest "hire" on this list because it\'s not really a hire — it\'s a marriage. Most successful co-founder relationships start from existing networks, not job postings. If you\'re posting this role, be honest about whether you want a co-founder or a CTO.',
      },
      leverage_score: 5,
      time_to_impact: 3,
      cost_efficiency: 2,
    },

    // ── AI-Native Roles ──────────────────────────────────────────────────
    gtm_engineer: {
      title: 'GTM Engineer',
      why_now: 'Your go-to-market motion is manual and stitched together with spreadsheets and Zapier. A GTM Engineer builds the automated infrastructure that connects your CRM, outbound sequences, analytics, and billing into a single revenue machine. This role didn\'t exist two years ago — but in the AI era, it\'s the difference between a growth team that scales linearly and one that scales exponentially.',
      problem_it_solves: 'Eliminates manual GTM workflows; connects sales, marketing, and product data into automated revenue infrastructure',
      strategic_rationale: 'Most startups have a "GTM stack" that\'s really 12 SaaS tools held together with duct tape. A GTM Engineer replaces that with programmatic automation: AI-powered lead scoring, automated outbound personalization, real-time pipeline analytics, and self-healing integrations. The ROI is immediate — every sales rep becomes 2-3x more productive, and your cost per lead drops by 40-60%.',
      ninety_day_outcomes: [
        'Unified GTM data pipeline: CRM, product analytics, and billing connected in real-time',
        'AI-powered lead scoring model live; sales team prioritizing by predicted conversion, not gut feel',
        'Outbound automation: personalized sequences generated and deployed at scale',
        'Revenue attribution dashboard: know exactly which channels, campaigns, and touchpoints drive closed deals',
      ],
      person_to_avoid: 'Marketing ops person who only knows Hubspot point-and-click; pure developer who doesn\'t understand sales workflows; anyone who thinks "automation" means "more Zapier zaps"',
      interview_signals: ['Ask them to diagram your current GTM stack and identify the 3 biggest data gaps in 20 minutes', 'Look for someone who can write Python AND speak fluently about pipeline stages and conversion metrics', 'Red flag: they want to "evaluate tools" for 60 days before building anything'],
      compensation: {
        base_range: { low: 120000, high: 180000 },
        total_comp_range: { low: 150000, high: 230000 },
        equity_range: '0.05% - 0.2%',
        notes: 'GTM Engineer is an emerging role — comp benchmarks are still forming. Expect $120K-$180K base for candidates with 3-5 years of combined sales ops + engineering experience. The best ones come from revenue operations backgrounds with self-taught coding skills.',
        market_reality: 'This role is hard to hire for because it\'s a genuine hybrid. Pure engineers don\'t understand GTM; pure marketing ops can\'t code. Expect 4-6 weeks to find the right candidate. Consider a trial project as part of the interview process.',
      },
      leverage_score: 5,
      time_to_impact: 4,
      cost_efficiency: 5,
    },
    ai_software_engineer: {
      title: 'AI Software Engineer',
      why_now: 'Every software product is becoming an AI product — but your engineering team is building the old way. An AI Software Engineer doesn\'t just integrate APIs; they architect systems where AI is a first-class citizen in the product, not a bolted-on feature. This is the role that separates AI-native companies from companies that "use AI."',
      problem_it_solves: 'Transforms product from traditional software to AI-native; builds the engineering patterns that make every future AI feature 10x faster to ship',
      strategic_rationale: 'The gap between "we use OpenAI\'s API" and "we have AI-native product architecture" is enormous. The former gives you features; the latter gives you a moat. An AI Software Engineer builds the retrieval systems, prompt pipelines, evaluation frameworks, and feedback loops that turn one-off AI features into a compounding product advantage.',
      ninety_day_outcomes: [
        'AI product architecture established: prompt management, model routing, evaluation pipeline, and cost monitoring',
        'First 2-3 AI-native features shipped to production with automated quality checks',
        'RAG pipeline or knowledge system operational for at least one core product workflow',
        'Engineering team trained on AI-native development patterns; internal playbook published',
      ],
      person_to_avoid: 'ML researcher who wants to train custom models before trying off-the-shelf solutions; backend engineer who treats AI as "just another API call"; anyone who can\'t explain latency/cost/quality tradeoffs to a PM',
      interview_signals: ['Give them a product scenario and ask them to design the AI architecture on a whiteboard — including error handling, fallbacks, and cost projections', 'Look for someone who has shipped AI features to real users, not just built demos', 'Red flag: they talk about model architecture but not user experience or production reliability'],
      compensation: {
        base_range: { low: 140000, high: 200000 },
        total_comp_range: { low: 160000, high: 250000 },
        equity_range: '0.05% - 0.25%',
        notes: 'AI Software Engineers command a 20-30% premium over traditional senior engineers. The market is splitting into "AI-augmented engineers" (use Copilot, $150K-$200K) and "AI product engineers" (build AI features, $180K-$250K). You want the latter.',
        market_reality: 'Extremely competitive market. Candidates with production AI experience are fielding 8-12 offers. Speed is your competitive advantage at seed/Series A — big companies move slowly on offers. Close within 5 business days of final interview or lose them.',
      },
      leverage_score: 5,
      time_to_impact: 5,
      cost_efficiency: 4,
    },
    context_engineer: {
      title: 'Context Engineer',
      why_now: 'Your AI features are only as good as the context they receive. A Context Engineer designs the information architecture that feeds your AI systems — retrieval pipelines, knowledge graphs, embedding strategies, and context windows. This is the role that turns "AI that hallucinates" into "AI that\'s reliably useful."',
      problem_it_solves: 'Fixes AI accuracy and relevance issues at the root; builds the knowledge infrastructure that makes every AI feature trustworthy',
      strategic_rationale: 'Most AI product failures aren\'t model failures — they\'re context failures. The model is fine; it just doesn\'t have the right information at the right time. A Context Engineer solves this systematically: they build the retrieval, ranking, and relevance systems that ensure your AI always has the context it needs. This is the emerging discipline that will define AI product quality for the next decade.',
      ninety_day_outcomes: [
        'Context architecture documented: what data feeds each AI feature, how it\'s retrieved, and how relevance is scored',
        'RAG pipeline optimized: retrieval accuracy improved 30-50% through better chunking, embedding, and ranking strategies',
        'Knowledge graph or structured data layer operational for core product domain',
        'Context quality metrics established: automated evaluation of retrieval relevance, freshness, and completeness',
      ],
      person_to_avoid: 'Pure data engineer who thinks in ETL pipelines but not semantic relevance; ML researcher focused on model fine-tuning instead of information retrieval; anyone who dismisses RAG as "just search"',
      interview_signals: ['Ask them to design a context pipeline for a specific AI feature in your product — look for depth on chunking strategy, ranking, and failure modes', 'Look for someone who understands both information retrieval and LLM behavior', 'Red flag: they jump to fine-tuning or model training before asking about the data'],
      compensation: {
        base_range: { low: 130000, high: 180000 },
        total_comp_range: { low: 160000, high: 210000 },
        equity_range: '0.05% - 0.2%',
        notes: 'Context Engineering is a brand-new discipline — comp benchmarks are emerging. Current market: $130K-$180K base for strong candidates. Expect this to increase 15-20% annually as the role becomes more defined.',
        market_reality: 'Very few people have "Context Engineer" as their title yet. Look for information retrieval engineers, search engineers, or applied ML engineers who have worked on RAG systems. The talent pool is small but growing fast.',
      },
      leverage_score: 4,
      time_to_impact: 4,
      cost_efficiency: 4,
    },
    ai_product_manager: {
      title: 'AI Product Manager',
      why_now: 'Traditional product management doesn\'t work for AI products. AI features are probabilistic, not deterministic — they require different success metrics, different user expectations, and different iteration cycles. An AI PM bridges the gap between what the AI can do and what users actually need.',
      problem_it_solves: 'Translates AI capabilities into product value; prevents the "cool demo that nobody uses" problem that kills most AI features',
      strategic_rationale: 'The #1 reason AI features fail isn\'t technical — it\'s product. Teams build impressive AI capabilities that don\'t solve user problems, or solve them in ways that don\'t fit into existing workflows. An AI PM prevents this by defining the intersection of "technically possible," "user-valuable," and "economically viable." They also manage the unique challenges of AI products: hallucination rates, user trust, feedback loops, and the cold start problem.',
      ninety_day_outcomes: [
        'AI product strategy documented: which features, in what order, with what success metrics',
        'User research on AI feature expectations completed; trust and adoption framework in place',
        'First AI feature launched with proper user education, feedback collection, and iteration plan',
        'AI product metrics dashboard live: usage, accuracy, user satisfaction, and cost per interaction',
      ],
      person_to_avoid: 'Traditional PM who thinks AI features are like regular features but "smarter"; anyone who can\'t explain precision/recall tradeoffs to a non-technical stakeholder; PM who focuses on "AI for AI\'s sake" without clear user value',
      interview_signals: ['Ask them to define success metrics for an AI feature that\'s probabilistic (not deterministic)', 'Look for someone who has launched AI features and dealt with the trust/adoption challenge', 'Red flag: they treat AI features as checkboxes on a roadmap instead of iterative systems'],
      compensation: {
        base_range: { low: 140000, high: 200000 },
        total_comp_range: { low: 180000, high: 260000 },
        equity_range: '0.05% - 0.3%',
        notes: 'AI PMs command a 20-30% premium over traditional PMs. The best ones have both product management and technical AI experience — they\'ve shipped AI features, not just managed engineers who do.',
        market_reality: 'Rare role. Most "AI PMs" are traditional PMs who added "AI" to their LinkedIn. Screen hard for actual AI product experience: have they dealt with hallucination, trust, cold start, and feedback loops? If they can\'t speak to these, they\'re a traditional PM with a new title.',
      },
      leverage_score: 4,
      time_to_impact: 4,
      cost_efficiency: 3,
    },
    growth_engineer: {
      title: 'Growth Engineer',
      why_now: 'Your growth team has ideas but no one to build the experiments. A Growth Engineer is a full-stack developer who sits on the growth team, not the product team — they build landing pages, optimize funnels, run A/B tests, and instrument analytics at the speed of marketing, not the speed of product sprints.',
      problem_it_solves: 'Breaks the growth team\'s dependency on engineering sprints; enables 10x more growth experiments per quarter',
      strategic_rationale: 'Growth teams without their own engineer are limited to whatever the product team can squeeze in. A Growth Engineer changes the math: instead of 2-3 experiments per quarter, you run 10-15. At $150K-$220K total comp, a Growth Engineer who improves conversion by even 10% typically delivers 5-10x ROI within 6 months.',
      ninety_day_outcomes: [
        'Growth experimentation infrastructure built: A/B testing framework, event tracking, and funnel analytics',
        'First 5-10 experiments run with statistically significant results',
        'Landing page performance improved: load time, conversion rate, and SEO signals',
        'AI-powered growth tools deployed: dynamic personalization, automated copy testing, or predictive lead scoring',
      ],
      person_to_avoid: 'Backend engineer who thinks "growth hacking" is beneath them; front-end developer who can\'t work with analytics and data pipelines; anyone who needs a PM to tell them what to test',
      interview_signals: ['Ask them to audit your current funnel and propose 3 experiments they\'d run in week 1', 'Look for someone who speaks in conversion metrics, not just code quality', 'Red flag: they want to "build a proper architecture" before running any experiments'],
      compensation: {
        base_range: { low: 120000, high: 170000 },
        total_comp_range: { low: 150000, high: 220000 },
        equity_range: '0.05% - 0.2%',
        notes: 'Growth Engineers are slightly below traditional senior engineers on base but often have performance bonuses tied to growth metrics. The best ones have a mix of engineering and marketing analytics skills.',
        market_reality: 'Easier to find than AI engineers but harder than general full-stack. Look for engineers who have worked at growth-stage startups and have opinions about conversion optimization. The best Growth Engineers are obsessed with metrics, not just code.',
      },
      leverage_score: 5,
      time_to_impact: 5,
      cost_efficiency: 5,
    },
    revops_engineer: {
      title: 'RevOps Engineer',
      why_now: 'Your revenue operations are held together with manual processes and spreadsheets. A RevOps Engineer automates the entire revenue lifecycle: lead routing, pipeline management, forecasting, billing, and renewal workflows. They turn your revenue team from data-entry operators into strategic closers.',
      problem_it_solves: 'Automates manual revenue operations; gives sales leadership real-time visibility into pipeline health and forecasting accuracy',
      strategic_rationale: 'Most companies at your stage have a RevOps "function" that\'s really one person doing manual data hygiene in Salesforce. A RevOps Engineer transforms this into programmatic infrastructure: automated lead scoring, real-time pipeline alerts, AI-powered forecasting, and self-service reporting for every revenue team member. The unlock is massive — sales reps spend 70% of their time selling instead of 40%.',
      ninety_day_outcomes: [
        'CRM data quality automated: deduplication, enrichment, and hygiene running on schedule',
        'Lead routing and scoring model deployed; sales reps receiving pre-qualified leads automatically',
        'Revenue forecasting model operational with 80%+ accuracy on 30-day predictions',
        'Sales analytics dashboard: pipeline velocity, stage conversion, rep performance, and churn risk',
      ],
      person_to_avoid: 'Salesforce admin who only knows point-and-click configuration; pure data analyst without systems integration skills; anyone who treats RevOps as "keeping the CRM clean"',
      interview_signals: ['Ask them to map your current revenue data flow and identify where deals get stuck or data gets lost', 'Look for someone who can write code AND understand quota attainment and pipeline metrics', 'Red flag: their first instinct is to buy another tool instead of building automation'],
      compensation: {
        base_range: { low: 100000, high: 150000 },
        total_comp_range: { low: 170000, high: 200000 },
        equity_range: '0.03% - 0.15%',
        notes: 'RevOps Engineers are one of the best ROI hires you can make. At $100K-$150K base, they typically save 2-3x their salary in recovered sales productivity within the first year.',
        market_reality: 'Growing talent pool as revenue operations matures as a discipline. Look for candidates from high-growth SaaS companies who have built RevOps infrastructure from scratch. The best ones have both Salesforce expertise and real programming skills (Python, SQL, APIs).',
      },
      leverage_score: 4,
      time_to_impact: 4,
      cost_efficiency: 5,
    },
    llm_generative_ai_engineer: {
      title: 'LLM / Generative AI Engineer',
      why_now: 'You\'re building AI-powered features but treating LLMs as black boxes. An LLM Engineer understands the full stack — from prompt engineering and fine-tuning to inference optimization and evaluation pipelines. They\'re the difference between "we call the API" and "we have a world-class AI product."',
      problem_it_solves: 'Builds production-grade LLM systems; optimizes cost, latency, and quality of generative AI features',
      strategic_rationale: 'The LLM landscape is evolving weekly. Model capabilities, pricing, and best practices shift constantly. An LLM Engineer keeps your product on the frontier: they evaluate new models, optimize prompts, build evaluation frameworks, and manage the cost/quality tradeoff that determines whether your AI features are profitable or a money pit.',
      ninety_day_outcomes: [
        'LLM evaluation framework operational: automated testing of prompt performance across models',
        'Cost optimization: 30-50% reduction in API costs through caching, prompt optimization, and model routing',
        'Production LLM pipeline with monitoring, fallbacks, and quality gates',
        'Fine-tuning or distillation pipeline for your highest-volume use cases',
      ],
      person_to_avoid: 'Researcher who wants to publish papers instead of ship features; engineer who only knows one model provider; anyone who dismisses prompt engineering as "not real engineering"',
      interview_signals: ['Ask them to optimize a production prompt for cost and quality — give them a real example from your product', 'Look for someone who can discuss model selection tradeoffs (cost, latency, capability) fluently', 'Red flag: they want to fine-tune everything instead of starting with prompt engineering'],
      compensation: {
        base_range: { low: 150000, high: 220000 },
        total_comp_range: { low: 200000, high: 300000 },
        equity_range: '0.1% - 0.3%',
        notes: 'LLM/GenAI engineers are in the top tier of engineering compensation. Expect $150K-$220K base with strong equity. Candidates with production LLM experience (not just research or demos) command the highest premiums.',
        market_reality: 'The hottest engineering role in the market. Top candidates receive 10+ offers and close within days. If you find someone strong, move to offer within 48 hours of final interview. Delayed offers lose candidates 100% of the time at this level.',
      },
      leverage_score: 5,
      time_to_impact: 4,
      cost_efficiency: 3,
    },
    ai_ops_engineer: {
      title: 'AI Ops Engineer (MLOps)',
      why_now: 'Your AI features are in production, but you have no infrastructure to monitor, scale, or maintain them. An AI Ops Engineer builds the platform that keeps your AI systems reliable: model monitoring, deployment pipelines, cost tracking, and automated retraining. Without this role, every AI feature becomes a maintenance liability.',
      problem_it_solves: 'Transforms ad-hoc AI deployments into reliable, scalable infrastructure; prevents the "AI feature that works in demo but breaks in production" problem',
      strategic_rationale: 'The operational complexity of AI systems is 3-5x higher than traditional software. Models drift, costs spike, latency degrades, and quality regressions are invisible until users complain. An AI Ops Engineer builds the guardrails that let your product team ship AI features fast without breaking production.',
      ninety_day_outcomes: [
        'AI deployment pipeline automated: model versioning, staging, and production rollout with rollback capability',
        'Monitoring dashboard live: model performance, latency, cost per query, and quality metrics',
        'Cost optimization: automated scaling, caching, and model routing reduce AI infrastructure costs 25-40%',
        'Incident response playbook for AI-specific failures: hallucination spikes, latency degradation, provider outages',
      ],
      person_to_avoid: 'Traditional DevOps engineer who doesn\'t understand ML model lifecycle; ML engineer who only cares about model performance, not operational reliability; anyone who treats infrastructure as "someone else\'s problem"',
      interview_signals: ['Ask them to design a monitoring system for an AI feature that could hallucinate or degrade silently', 'Look for someone who has dealt with AI-specific production incidents', 'Red flag: they can\'t explain the difference between traditional software monitoring and ML monitoring'],
      compensation: {
        base_range: { low: 120000, high: 180000 },
        total_comp_range: { low: 160000, high: 220000 },
        equity_range: '0.05% - 0.2%',
        notes: 'AI Ops / MLOps engineers are priced between traditional DevOps and AI engineers. Expect $120K-$180K base. Candidates with Kubernetes + ML pipeline experience command the upper range.',
        market_reality: 'Growing talent pool as MLOps matures as a discipline. Look for candidates who have built ML pipelines at production scale — not just experimented with MLflow in a notebook. The best ones come from high-traffic AI products where reliability was non-negotiable.',
      },
      leverage_score: 3,
      time_to_impact: 3,
      cost_efficiency: 4,
    },
    human_ai_interaction_designer: {
      title: 'Human-AI Interaction Designer',
      why_now: 'Your AI features are technically impressive but users don\'t trust or adopt them. A Human-AI Interaction Designer solves the hardest problem in AI products: making AI feel reliable, transparent, and useful to real humans. They design the trust signals, error recovery, and interaction patterns that turn "cool AI demo" into "product users depend on."',
      problem_it_solves: 'Fixes AI feature adoption and trust issues; designs the user experience layer that makes AI products feel reliable',
      strategic_rationale: 'The biggest risk in AI product development isn\'t the technology — it\'s user adoption. Studies show that 60-70% of AI features go unused because users don\'t trust or understand them. A Human-AI Interaction Designer prevents this by designing confidence indicators, graceful degradation, feedback loops, and explanation interfaces that build user trust systematically.',
      ninety_day_outcomes: [
        'AI interaction design system established: patterns for confidence display, error states, and human override',
        'User trust metrics defined and baselined: adoption rate, override frequency, satisfaction scores',
        'First AI feature redesigned with trust-building UX; adoption rate improved 25-50%',
        'Human-in-the-loop workflow designed: when to automate, when to suggest, when to ask for confirmation',
      ],
      person_to_avoid: 'Traditional UX designer who treats AI outputs as static content; visual designer without interaction design depth; anyone who hasn\'t worked with probabilistic systems before',
      interview_signals: ['Ask them to redesign an AI feature where users currently don\'t trust the output', 'Look for someone who can articulate why AI UX is fundamentally different from traditional UX', 'Red flag: they treat AI outputs as "just another content source" without considering confidence, uncertainty, and error recovery'],
      compensation: {
        base_range: { low: 110000, high: 160000 },
        total_comp_range: { low: 140000, high: 210000 },
        equity_range: '0.03% - 0.15%',
        notes: 'Human-AI Interaction Design is an emerging specialty. Current comp aligns with senior UX/product design roles + 10-15% premium for AI expertise. Expect this to increase as the discipline matures.',
        market_reality: 'Very small talent pool. Most candidates come from conversational AI companies (chatbots, voice assistants), autonomous vehicle HMI teams, or medical AI products where trust is critical. Be prepared to hire a strong senior UX designer and invest in their AI-specific training.',
      },
      leverage_score: 3,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
    ai_compliance_manager: {
      title: 'AI Compliance Manager',
      why_now: 'AI regulation is here — the EU AI Act, state-level laws, and enterprise procurement requirements are creating compliance obligations that your engineering team can\'t handle alone. An AI Compliance Manager builds the governance framework that lets you ship AI features without legal risk and close enterprise deals that require AI compliance documentation.',
      problem_it_solves: 'Prevents regulatory exposure from AI features; unblocks enterprise sales by providing AI governance documentation',
      strategic_rationale: 'AI compliance is becoming a sales requirement, not just a legal one. Enterprise buyers increasingly require AI risk assessments, bias audits, and data governance documentation before purchasing AI-powered products. An AI Compliance Manager turns this from a blocker into a competitive advantage — the companies that have their AI governance house in order will close deals that competitors can\'t.',
      ninety_day_outcomes: [
        'AI governance framework established: risk assessment methodology, bias testing protocols, and documentation standards',
        'Compliance gap analysis complete for EU AI Act, relevant state regulations, and top 3 enterprise customer requirements',
        'AI model card and transparency documentation published for all production AI features',
        'Enterprise-ready AI compliance package: SOC 2 AI addendum, risk assessment template, and data processing agreements',
      ],
      person_to_avoid: 'Pure lawyer who doesn\'t understand AI technology; compliance checkbox-ticker who treats governance as paperwork; anyone who thinks AI compliance is "just like data privacy"',
      interview_signals: ['Ask them to explain the EU AI Act risk categories and how they apply to your product', 'Look for someone who can bridge technical AI concepts with regulatory requirements', 'Red flag: they focus only on documentation without understanding the underlying technology'],
      compensation: {
        base_range: { low: 125000, high: 200000 },
        total_comp_range: { low: 170000, high: 260000 },
        equity_range: '0.03% - 0.15%',
        notes: 'AI Compliance is a premium on top of traditional compliance roles. Expect $125K-$200K base. Candidates with both legal/compliance and technical AI backgrounds command the highest premiums.',
        market_reality: 'Emerging role with a small but rapidly growing talent pool. Look for candidates from regulated AI industries (fintech, healthcare, autonomous vehicles) or tech policy organizations. Some of the best candidates are lawyers who taught themselves machine learning.',
      },
      leverage_score: 2,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
    chief_ai_officer: {
      title: 'Chief AI Officer (CAIO)',
      why_now: 'Your company uses AI in multiple places but nobody owns the strategy. A CAIO unifies AI across product, operations, and strategy — ensuring every AI investment compounds rather than creating isolated experiments. This is a C-suite role that reports to the CEO and has authority over AI spending, tooling, and talent.',
      problem_it_solves: 'Unifies fragmented AI initiatives into a coherent strategy; ensures AI investments compound instead of competing',
      strategic_rationale: 'Companies with a dedicated AI leader outperform peers by 2-3x on AI ROI. Without a CAIO, AI initiatives proliferate without coordination: engineering builds product AI, ops builds process AI, and marketing builds content AI — all using different tools, vendors, and approaches. A CAIO creates the unified strategy, shared infrastructure, and governance that turns these islands into a continent.',
      ninety_day_outcomes: [
        'AI strategy document: vision, priorities, budget, and success metrics for next 12 months',
        'AI tech stack consolidated: single vendor strategy, shared infrastructure, and cost optimization across all teams',
        'AI talent plan: hiring roadmap, skill development for existing team, and organizational design for AI function',
        'AI governance framework: ethics guidelines, risk assessment, and compliance standards operational',
      ],
      person_to_avoid: 'Technologist who can\'t communicate with the board; strategist who can\'t evaluate technical decisions; anyone who wants to "build an AI team" before understanding the business problems',
      interview_signals: ['Ask them to evaluate your current AI spending and tell you what they\'d cut, keep, and invest in', 'Look for someone who can translate AI capabilities into business strategy and board-level communication', 'Red flag: they lead with "we need more data scientists" instead of "what business problems should AI solve?"'],
      compensation: {
        base_range: { low: 250000, high: 400000 },
        total_comp_range: { low: 400000, high: 750000 },
        equity_range: '0.5% - 1.5%',
        notes: 'CAIO is a C-suite role with C-suite compensation. Expect $250K-$400K base + substantial equity. The best candidates have a mix of technical AI expertise and P&L ownership experience.',
        market_reality: 'Very few proven CAIOs exist. Most are CTOs or VP Engineering who pivoted into the role. Don\'t hire a "Chief AI Officer" who has never owned a budget or reported to a CEO. This is a business leadership role with technical expertise, not a technical role with a fancy title.',
      },
      leverage_score: 4,
      time_to_impact: 3,
      cost_efficiency: 1,
    },
    ai_solutions_architect: {
      title: 'AI Solutions Architect',
      why_now: 'Your team is building AI features one-off, without a coherent architecture. An AI Solutions Architect designs the systems-level blueprint that connects your AI capabilities: shared model infrastructure, API gateways, evaluation frameworks, and integration patterns. They turn your scattered AI experiments into a platform that scales.',
      problem_it_solves: 'Creates the architectural foundation for scalable AI; prevents the "AI spaghetti" problem where every feature has its own model integration',
      strategic_rationale: 'Without an AI architect, every AI feature is built from scratch: new API integrations, new prompt chains, new evaluation logic. An AI Solutions Architect creates the shared platform — model routing, prompt management, caching, and monitoring — that makes the 10th AI feature as easy to build as the first. The productivity multiplier is 5-10x for your engineering team.',
      ninety_day_outcomes: [
        'AI platform architecture documented: model gateway, prompt management system, and evaluation framework',
        'Shared AI infrastructure deployed: centralized API management, caching layer, and cost tracking',
        'Integration patterns established: standard approach for adding AI to any product feature',
        'Vendor evaluation framework: criteria for model selection, cost benchmarking, and migration strategy',
      ],
      person_to_avoid: 'Traditional solutions architect who treats AI as "just another service"; ML researcher focused on model performance without systems thinking; anyone who designs architectures in slides but never implements them',
      interview_signals: ['Ask them to design an AI platform that supports 5 different AI features with different model requirements', 'Look for someone who thinks in systems, not features — they should talk about shared infrastructure, not individual API calls', 'Red flag: they want to standardize on one model provider instead of building for flexibility'],
      compensation: {
        base_range: { low: 145000, high: 180000 },
        total_comp_range: { low: 220000, high: 310000 },
        equity_range: '0.1% - 0.3%',
        notes: 'AI Solutions Architects are priced at the senior/staff engineer level. Expect $145K-$180K base with strong equity. Total comp of $220K-$310K reflects the strategic impact of the role.',
        market_reality: 'Look for candidates who have built AI platforms at scale, not just individual AI features. The best ones come from companies where AI is the product (not just a feature) and have experience with multi-model, multi-provider architectures.',
      },
      leverage_score: 4,
      time_to_impact: 3,
      cost_efficiency: 3,
    },
  };

  // Determine top 3 roles to recommend
  const candidates = [];

  if (bottleneck1 && roleMap[bottleneck1]) {
    candidates.push({ ...roleMap[bottleneck1], bottleneck_rank: 1 });
  }
  if (bottleneck2 && roleMap[bottleneck2]) {
    candidates.push({ ...roleMap[bottleneck2], bottleneck_rank: 2 });
  }
  if (bottleneck3 && roleMap[bottleneck3]) {
    candidates.push({ ...roleMap[bottleneck3], bottleneck_rank: 3 });
  }

  // Add objective-based role if no bottleneck match
  if (objective === 'add_ai_features' && !candidates.some((c) => c.title.includes('AI'))) {
    // Prefer AI Software Engineer for companies wanting AI features
    if (aiUsageLevel === 'company_wide' || aiUsageLevel === 'team_level') {
      candidates.push({ ...roleMap.ai_software_engineer, bottleneck_rank: 0 });
    } else {
      candidates.push({ ...roleMap.no_ai_capacity, bottleneck_rank: 0 });
    }
  }

  if (objective === 'improve_conversion_growth' && !candidates.some((c) => c.title.includes('Growth'))) {
    // Prefer Growth Engineer for AI-aware teams, Growth Lead for others
    if (aiUsageLevel !== 'none') {
      candidates.push({ ...roleMap.growth_engineer, bottleneck_rank: 0 });
    } else {
      candidates.push({ ...roleMap.weak_growth_engine, bottleneck_rank: 0 });
    }
  }

  // ── AI-native role injection based on context ──
  // GTM Engineer: for companies with weak growth + some AI readiness
  if ((bottleneck1 === 'weak_growth_engine' || bottleneck2 === 'weak_growth_engine') &&
      (aiUsageLevel === 'team_level' || aiUsageLevel === 'company_wide') &&
      !candidates.some((c) => c.title === 'GTM Engineer')) {
    candidates.push({ ...roleMap.gtm_engineer, bottleneck_rank: 0 });
  }

  // LLM Engineer: for companies wanting AI features with existing AI capacity
  if (objective === 'add_ai_features' && aiUsageLevel === 'company_wide' &&
      !candidates.some((c) => c.title.includes('LLM'))) {
    candidates.push({ ...roleMap.llm_generative_ai_engineer, bottleneck_rank: 0 });
  }

  // AI Product Manager: for companies with AI features objective at Series A+
  if (objective === 'add_ai_features' &&
      ['series_a', 'series_b', 'series_c', 'post_growth'].includes(stage) &&
      !candidates.some((c) => c.title === 'AI Product Manager')) {
    candidates.push({ ...roleMap.ai_product_manager, bottleneck_rank: 0 });
  }

  // Chief AI Officer: for larger companies (Series B+, 40+ people) with AI objectives
  if (['series_b', 'series_c', 'post_growth'].includes(stage) && headcount >= 40 &&
      (objective === 'add_ai_features' || aiUsageLevel === 'company_wide') &&
      !candidates.some((c) => c.title.includes('Chief AI'))) {
    candidates.push({ ...roleMap.chief_ai_officer, bottleneck_rank: 0 });
  }

  // RevOps Engineer: for companies with poor analytics + growth objectives
  if ((bottleneck1 === 'poor_analytics' || bottleneck2 === 'poor_analytics') &&
      objective === 'improve_conversion_growth' &&
      !candidates.some((c) => c.title === 'RevOps Engineer')) {
    candidates.push({ ...roleMap.revops_engineer, bottleneck_rank: 0 });
  }

  // AI Compliance Manager: for Series B+ companies with AI features
  if (['series_b', 'series_c', 'post_growth'].includes(stage) &&
      (objective === 'add_ai_features' || aiUsageLevel === 'company_wide') &&
      headcount >= 30 &&
      !candidates.some((c) => c.title === 'AI Compliance Manager')) {
    candidates.push({ ...roleMap.ai_compliance_manager, bottleneck_rank: 0 });
  }

  // Compute composite score for ranking
  candidates.forEach((role) => {
    role.composite = role.leverage_score * 0.4 + role.time_to_impact * 0.3 + role.cost_efficiency * 0.3;
  });

  // Sort by composite score descending
  candidates.sort((a, b) => b.composite - a.composite);

  // ISSUE 2 FIX: Ensure exactly 3 unique roles are returned
  const uniqueRoles = [];
  const seenTitles = new Set();

  // Add unique roles from candidates
  for (const role of candidates) {
    if (!seenTitles.has(role.title)) {
      uniqueRoles.push(role);
      seenTitles.add(role.title);
      if (uniqueRoles.length === 3) break;
    }
  }

  // If fewer than 3 unique roles, add supplementary roles based on company context
  if (uniqueRoles.length < 3) {
    // Supplementary 1: Early stage under 15 headcount
    if ((stage === 'seed' || stage === 'pre_seed') && headcount < 15) {
      if (!seenTitles.has('Technical Co-founder / CTO') && uniqueRoles.length < 3) {
        uniqueRoles.push({ ...roleMap.technical_cofounder, bottleneck_rank: 0 });
        seenTitles.add('Technical Co-founder / CTO');
      }
    }

    // Supplementary 2: Scaling or people ops need
    if (uniqueRoles.length < 3 && objective === 'prepare_for_scale_leadership') {
      if (!seenTitles.has('VP Engineering')) {
        uniqueRoles.push({ ...roleMap.vp_engineering, bottleneck_rank: 0 });
        seenTitles.add('VP Engineering');
      }
    }

    // Supplementary 3: AI readiness gap — recommend AI-native roles based on maturity
    if (uniqueRoles.length < 3 && (aiUsageLevel === 'none' || aiUsageLevel === 'informal')) {
      if (!seenTitles.has('AI/ML Engineer or AI Ops Lead') && !seenTitles.has('AI Software Engineer')) {
        uniqueRoles.push({ ...roleMap.no_ai_capacity, bottleneck_rank: 0 });
        seenTitles.add('AI/ML Engineer or AI Ops Lead');
      }
    }

    // Supplementary 3b: AI-fluent teams get more advanced AI-native roles
    if (uniqueRoles.length < 3 && (aiUsageLevel === 'team_level' || aiUsageLevel === 'company_wide')) {
      if (!seenTitles.has('AI Software Engineer') && !seenTitles.has('AI/ML Engineer or AI Ops Lead')) {
        uniqueRoles.push({ ...roleMap.ai_software_engineer, bottleneck_rank: 0 });
        seenTitles.add('AI Software Engineer');
      }
    }

    // Supplementary 4: Recruiting need
    if (uniqueRoles.length < 3 && needRecruiting === 'yes') {
      if (!seenTitles.has('Fractional Head of Talent')) {
        uniqueRoles.push({ ...roleMap.hiring_wrong_profiles, bottleneck_rank: 0 });
        seenTitles.add('Fractional Head of Talent');
      }
    }

    // Supplementary 5: GTM Engineer for growth-focused companies with some AI adoption
    if (uniqueRoles.length < 3 && objective === 'improve_conversion_growth' &&
        (aiUsageLevel === 'team_level' || aiUsageLevel === 'company_wide') &&
        !seenTitles.has('GTM Engineer')) {
      uniqueRoles.push({ ...roleMap.gtm_engineer, bottleneck_rank: 0 });
      seenTitles.add('GTM Engineer');
    }

    // Supplementary 6: Growth Engineer for growth-focused companies
    if (uniqueRoles.length < 3 && objective === 'improve_conversion_growth' &&
        !seenTitles.has('Growth Engineer') && !seenTitles.has('Growth Lead / Demand Gen Manager')) {
      uniqueRoles.push({ ...roleMap.growth_engineer, bottleneck_rank: 0 });
      seenTitles.add('Growth Engineer');
    }

    // Fallback 1: Add VP Engineering for mid-stage companies
    if (uniqueRoles.length < 3 && !seenTitles.has('VP Engineering') && (stage === 'series_a' || stage === 'series_b')) {
      uniqueRoles.push({ ...roleMap.vp_engineering, bottleneck_rank: 0 });
      seenTitles.add('VP Engineering');
    }

    // Fallback 2: Add Head of People for scaling
    if (uniqueRoles.length < 3 && !seenTitles.has('Head of People') && headcount >= 15) {
      uniqueRoles.push({ ...roleMap.head_of_people, bottleneck_rank: 0 });
      seenTitles.add('Head of People');
    }

    // Fallback 3: AI Solutions Architect for companies with AI features
    if (uniqueRoles.length < 3 && objective === 'add_ai_features' &&
        !seenTitles.has('AI Solutions Architect')) {
      uniqueRoles.push({ ...roleMap.ai_solutions_architect, bottleneck_rank: 0 });
      seenTitles.add('AI Solutions Architect');
    }

    // Fallback 4: Generic fallback to data analyst
    if (uniqueRoles.length < 3 && !seenTitles.has('Data Analyst / Analytics Engineer')) {
      uniqueRoles.push({ ...roleMap.poor_analytics, bottleneck_rank: 0 });
      seenTitles.add('Data Analyst / Analytics Engineer');
    }
  }

  // Always return exactly 3 roles, trim if needed
  return uniqueRoles.slice(0, 3);
}

/**
 * Determine CTA tier and message
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {string} hiringPosture - Hiring posture
 * @returns {Object} CTA object with tier, message, and link
 */
function determineCTA(responses, scores, hiringPosture) {
  const urgency = scores.hiring_urgency;
  const needRecruiting = responses.need_recruiting === 'yes';
  const hasUrgentRoles = urgency >= 4;

  if (hasUrgentRoles && needRecruiting) {
    return {
      tier: 'high',
      message: 'You have urgent roles and a complex hiring picture. See how we help teams like yours design the right hires — not just fill seats.',
      link: 'https://humaninthelooptalent.com',
    };
  }

  if (hiringPosture === 'do not hire yet; redesign workflow first' || hiringPosture === 'build internal AI ops before adding headcount') {
    return {
      tier: 'soft',
      message: 'You don\'t need candidates yet. You need clarity. Learn how we help teams design the right workforce architecture first.',
      link: 'https://humaninthelooptalent.com',
    };
  }

  return {
    tier: 'medium',
    message: 'Your next hire should create leverage, not just fill a gap. See how we help teams build smarter.',
    link: 'https://humaninthelooptalent.com',
  };
}

/**
 * Generate organizational diagnosis
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {string} archetype - Team archetype
 * @returns {Object} Diagnosis object
 */
function generateDiagnosis(responses, scores, archetype) {
  const stage = responses.stage || 'seed';
  const headcount = parseInt(responses.headcount || '0', 10);
  const objective = responses.primary_objective || '';
  const opsCount = parseInt(responses.team_ops_support || responses.ops_support_count || '0', 10);

  // Archetype-specific executive summaries and diagnoses
  let executive_summary = '';
  let what_is_broken = [];
  let what_is_not_broken = [];

  if (archetype === 'founder-led scrappy builder team') {
    executive_summary = `Your team is built around founder instinct, not organizational architecture. At ${headcount} people, that model is starting to crack — the bottleneck isn't talent, it's that every decision still routes through one person.`;
    what_is_broken = [
      `Founder dependency: ${responses.bottleneck_1 === 'founder_dependency' ? 'confirmed as primary constraint' : 'likely present based on stage/size'}.`,
      `No documented processes: decisions live in founder's head, not in playbooks.`,
      `Role clarity is ${scores.role_clarity}/5: without ownership distribution, this won't scale beyond ${headcount + 5}.`,
    ];
    what_is_not_broken = [
      `Founder instinct has proven the product works—that's not small.`,
      `Team is scrappy and moves fast when aligned around founder vision.`,
      `You have a runway to build structure before hypergrowth forces it.`,
    ];
  } else if (archetype === 'product-heavy shipping team') {
    executive_summary = `You have a shipping machine, but it's optimized for velocity, not leverage. Your ${headcount}-person team can build fast — the question is whether you're building the right things, with the right level of AI augmentation.`;
    what_is_broken = [
      `Execution rhythm is tight, but you're missing visibility: AI readiness is ${scores.ai_readiness}/5, meaning you're not capturing the 2-3x productivity multiplier available.`,
      `Growth clarity: ${objective === 'improve_conversion_growth' ? 'you have shipping velocity but no growth engine yet' : 'growth is unclear relative to product velocity'}.`,
      `Role clarity is ${scores.role_clarity}/5: product direction may be owned by one or two people, creating bottleneck risk.`,
    ];
    what_is_not_broken = [
      `Shipping velocity is high—your team can execute and iterate.`,
      `Product resonates enough to justify the pace you're keeping.`,
      `Leverage opportunity (${scores.leverage_opportunity}/5) is solid; the right addition scales output without adding headcount.`,
    ];
  } else if (archetype === 'growth-constrained team') {
    executive_summary = `You've proven the product works. Now the constraint is distribution, not development. With ${headcount} people at ${stage}, the gap isn't in what you build — it's in how you grow.`;
    what_is_broken = [
      `Growth engine weakness: ${responses.bottleneck_1 === 'weak_growth_engine' ? 'confirmed' : 'suspected'}, you have product-market fit signals but no repeatable acquisition machine.`,
      `No growth playbook: you're likely acquiring users ad-hoc, not through repeatable channels.`,
      `Growth ownership is unclear: no single person owns the funnel end-to-end.`,
    ];
    what_is_not_broken = [
      `Product is proven: you have validation that users want what you built.`,
      `Team can execute on growth plays once they're defined.`,
      `${headcount} people is enough to run parallel growth experiments if orchestrated.`,
    ];
  } else if (archetype === 'operations-heavy but under-automated team') {
    executive_summary = `Half your team is running operations manually. At ${headcount} people with ${opsCount} in ops/support and zero AI integration, you're paying human rates for work that machines should handle.`;
    what_is_broken = [
      `${opsCount}/${headcount} of your team (${Math.round((opsCount / headcount) * 100)}%) is tied up in operations, but ops is not optimized—it's just labor.`,
      `AI readiness is ${scores.ai_readiness}/5: you have the highest leverage opportunity by shifting ops work to AI automation.`,
      `Cost structure: you're overstaffed in ops roles that AI/automation could reduce by 40-60% in 90 days.`,
    ];
    what_is_not_broken = [
      `Your ops team understands the work deeply—that's the foundation for automation.`,
      `You have budget/headcount to invest in automation infrastructure.`,
      `Leverage opportunity (${scores.leverage_opportunity}/5) is among the highest possible: low AI + high ops overhead = biggest ROI.`,
    ];
  } else if (archetype === 'specialist-bloated team') {
    executive_summary = `You've hired for expertise, but your specialists aren't multiplying each other. Too many narrow roles, not enough builders who can work across boundaries.`;
    what_is_broken = [
      `Specialist proliferation: ${responses.bottleneck_1 === 'too_many_specialists' ? 'confirmed' : 'likely'}, you have deep expertise but limited cross-pollination.`,
      `Coordination overhead: every project requires handoffs between specialists, slowing shipping.`,
      `Execution bottleneck severity is ${scores.execution_bottleneck_severity}/5; the specialist model doesn't scale without more orchestration.`,
    ];
    what_is_not_broken = [
      `Your specialists are competent in their domains—the issue is structure, not talent quality.`,
      `You have proof that the company can attract expert-level people.`,
      `Adding a player-coach can glue teams together without replacing anyone.`,
    ];
  } else if (archetype === 'AI-transition team') {
    executive_summary = `Your team is already AI-aware, which puts you ahead of 80% of companies your size. The question now is whether you treat AI as a tool or as a core part of your operating model.`;
    what_is_broken = [
      `AI readiness is ${scores.ai_readiness}/5: you're beyond awareness, but not yet systematized—AI is ad-hoc, not embedded in workflows.`,
      `No AI ops infrastructure: teams are using AI individually, but there's no platform, governance, or knowledge share.`,
      `Objective alignment: you want to ${objective || 'add AI features'}, but it's not baked into hiring, architecture, or metrics yet.`,
    ];
    what_is_not_broken = [
      `Team mindset: you've already cleared the biggest hurdle—skepticism. Buy-in exists.`,
      `You have real use cases for AI that teams are experimenting with.`,
      `Leverage opportunity (${scores.leverage_opportunity}/5): you're close to the inflection point where AI integration becomes 3-5x ROI.`,
    ];
  }

  return {
    executive_summary,
    what_is_broken,
    what_is_not_broken,
    team_type_needed: determineTeamTypeNeeded(responses, scores, archetype),
  };
}

/**
 * Determine the type of team/hires needed
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {string} archetype - Team archetype
 * @returns {Array} Array of strings describing needed team composition
 */
function determineTeamTypeNeeded(responses, scores, archetype) {
  const needed = [];

  const aiUsageLevel = responses.ai_usage_level || 'none';
  const objective = responses.primary_objective || '';

  if (scores.ai_readiness <= 2) {
    needed.push('AI Software Engineer or AI Ops Lead to build internal AI infrastructure and train team');
  }

  if (scores.role_clarity <= 2) {
    needed.push('Executive-level operator (VP Eng, Chief of Staff, or Product Lead) to own strategy and clarity');
  }

  if (scores.execution_bottleneck_severity >= 4) {
    needed.push('Specialist in bottleneck area (e.g., Growth Engineer if weak_growth_engine, AI-fluent engineer if slow_shipping)');
  }

  if (responses.hiring_urgency === 'asap' && responses.need_recruiting === 'yes') {
    needed.push('Fractional talent lead or recruiter to fix hiring pipeline');
  }

  // AI-native role recommendations based on maturity
  if (aiUsageLevel === 'company_wide' && objective === 'add_ai_features') {
    needed.push('LLM/GenAI Engineer or Context Engineer to build production-grade AI product features');
  }

  if (objective === 'improve_conversion_growth' && (aiUsageLevel === 'team_level' || aiUsageLevel === 'company_wide')) {
    needed.push('GTM Engineer or Growth Engineer to automate and scale revenue operations');
  }

  return needed.length > 0 ? needed : ['Generalist operator who can move across multiple domains'];
}

/**
 * Generate hiring roadmap (hire now, hire later, do not hire)
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {string} hiringPosture - Hiring posture
 * @param {Array} recommendedRoles - Recommended roles array
 * @returns {Object} Hiring roadmap with categories
 */
function generateHireNowLaterAvoid(responses, scores, hiringPosture, recommendedRoles) {
  const urgency = scores.hiring_urgency;
  const stage = responses.stage || 'seed';
  const budget = responses.hiring_budget || 'low';

  const hireNow = [];
  const hireLater = [];
  const doNotHire = [];

  // Determine which roles fall into which bucket
  recommendedRoles.forEach((role, idx) => {
    if (idx === 0 && urgency >= 4 && budget !== 'low') {
      // Highest-ranked role + urgency + budget = hire now
      hireNow.push(`${role.title} (expected impact in 90 days: ${role.ninety_day_outcomes[0]})`);
    } else if (idx <= 1 && urgency >= 3) {
      hireNow.push(`${role.title} (addresses critical bottleneck)`);
    } else if (idx === 1 || urgency >= 2) {
      hireLater.push(`${role.title} (Q${stage === 'seed' ? 2 : 3} priority; consolidate learning from first hire first)`);
    }
  });

  // Do not hire categories based on posture
  if (hiringPosture === 'do not hire yet; redesign workflow first') {
    doNotHire.push('Generic developers or coordinators; focus workflow optimization first');
  }

  if (scores.ai_readiness <= 1) {
    doNotHire.push('Specialists in new domains; build internal capability first');
  }

  return {
    hire_now: hireNow.length > 0 ? hireNow : ['Hold on hiring until clarity on bottleneck is achieved'],
    hire_later:
      hireLater.length > 0
        ? hireLater
        : ['Re-evaluate after first hire impact is measured; revisit hiring roadmap in 60 days'],
    do_not_hire:
      doNotHire.length > 0
        ? doNotHire
        : ['Mid-level generalists; focus on high-leverage specialists or fractional leads first'],
  };
}

/**
 * Generate organizational structure insights
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @returns {Object} Org structure recommendations
 */
function generateOrgShape(responses, scores) {
  const archetype = responses.archetype_determined || 'unknown';
  const ownsRoadmap = responses.owns_roadmap || 'unclear';
  const ownsGrowth = responses.owns_growth || 'unclear';
  const ownsAi = responses.owns_ai || 'unclear';

  let currentPattern = 'ad-hoc / unclear hierarchy';
  if (ownsRoadmap !== 'unclear' && ownsGrowth !== 'unclear' && ownsAi !== 'unclear') {
    currentPattern = 'defined ownership but possible silos';
  }

  const recommendedStructure = [];
  const ownershipChanges = [];

  if (scores.role_clarity <= 2) {
    recommendedStructure.push({
      name: 'Define clear ownership buckets',
      details: 'Assign explicit owners for: (1) Product/Roadmap, (2) Growth/Revenue, (3) AI/Infrastructure',
    });
    ownershipChanges.push(`Roadmap: ${ownsRoadmap || 'TBD'} → explicit owner (e.g., CPO or VP Eng)`);
    ownershipChanges.push(`Growth: ${ownsGrowth || 'TBD'} → explicit owner (e.g., VP Growth or Founder)`);
    ownershipChanges.push(`AI: ${ownsAi || 'TBD'} → explicit owner (e.g., AI Ops Lead or Eng Lead)`);
  }

  if (responses.bottleneck_1 === 'bloated_coordination' || responses.bottleneck_1 === 'too_many_specialists') {
    recommendedStructure.push({
      name: 'Reduce cross-functional friction',
      details: 'Introduce async communication protocols, decision logs, and reduce synchronous meeting time',
    });
  }

  if (scores.ai_readiness <= 2) {
    recommendedStructure.push({
      name: 'Establish AI ops function',
      details: 'Create single source of truth for prompt management, API integrations, and AI tool stack',
    });
  }

  return {
    current_pattern: currentPattern,
    recommended_structure: recommendedStructure,
    ownership_changes: ownershipChanges,
  };
}

/**
 * Generate 3-month roadmap
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {Array} recommendedRoles - Recommended roles
 * @returns {Object} Monthly roadmap
 */
function generateRoadmap(responses, scores, recommendedRoles) {
  const stage = responses.stage || 'seed';
  const objective = responses.primary_objective || '';

  return {
    month_1: {
      hiring: recommendedRoles[0]
        ? `Initiate search for ${recommendedRoles[0].title}; finalize JD and sourcing`
        : 'Confirm hiring priorities and freeze headcount plan',
      operations: 'Document current workflows; identify top 3 automation opportunities',
      ai_readiness: scores.ai_readiness <= 2 ? 'Audit current AI tool usage; create AI policy' : 'Expand AI usage to 1 new team',
      metrics: 'Establish baseline: bottleneck severity, role clarity, AI adoption',
    },

    month_2: {
      hiring:
        recommendedRoles[0] && scores.hiring_urgency >= 3
          ? `Offer/close first hire (${recommendedRoles[0].title})`
          : 'Continue sourcing; conduct interviews',
      operations:
        objective === 'reduce_costs'
          ? 'Implement 1-2 automation workflows; measure time savings'
          : 'Enable first hire; align on decision-making process',
      ai_readiness:
        scores.ai_readiness <= 2
          ? 'First AI tool rollout (internal use); train team on prompt engineering'
          : 'Integrate AI into 2nd team; measure productivity lift',
      metrics: 'Monthly check-in: hiring funnel health, automation ROI, bottleneck reduction',
    },

    month_3: {
      hiring:
        recommendedRoles[1]
          ? `Prepare sourcing for ${recommendedRoles[1].title}; evaluate first hire impact`
          : 'Decide: hire next role or consolidate first hire',
      operations:
        objective === 'ship_product_faster'
          ? 'Shipping velocity up 30%; first hire shipping with team'
          : objective === 'improve_conversion_growth'
            ? 'Growth playbook 1.0 complete; first lead gen campaign live'
            : 'Org clarity improved; decision log shows faster approvals',
      ai_readiness:
        'Assess AI ROI; plan next phase (product-facing AI vs internal tools)',
      metrics: 'End-of-quarter review: leverage gained, role clarity improved, next hiring tier',
    },
  };
}

/**
 * Generate budget risk analysis — equity traps, under-market hiring, and total cost modeling
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {Array} recommendedRoles - Recommended roles with compensation data
 * @returns {Object} Budget risk analysis
 */
function generateBudgetRiskAnalysis(responses, scores, recommendedRoles) {
  const stage = responses.stage || 'seed';
  const budget = responses.hiring_budget || 'under_50k';
  const headcount = parseInt(responses.headcount || '0', 10);
  const openToFractional = responses.open_to_fractional === 'yes';
  const revenue = responses.annual_revenue_range || 'pre_revenue';

  // Budget ranges mapping
  const budgetRanges = {
    under_50k: { low: 0, high: 50000, label: 'Under $50K' },
    '50k_150k': { low: 50000, high: 150000, label: '$50K–$150K' },
    '150k_500k': { low: 150000, high: 500000, label: '$150K–$500K' },
    '500k_1m': { low: 500000, high: 1000000, label: '$500K–$1M' },
    '1m_plus': { low: 1000000, high: 2000000, label: '$1M+' },
  };

  const budgetInfo = budgetRanges[budget] || budgetRanges.under_50k;

  // Calculate total market-rate cost for recommended roles
  let totalMinCost = 0;
  let totalMaxCost = 0;
  const roleCostBreakdown = [];

  recommendedRoles.forEach((role) => {
    if (role.compensation) {
      const min = role.compensation.total_comp_range?.low || role.compensation.base_range?.low || 0;
      const max = role.compensation.total_comp_range?.high || role.compensation.base_range?.high || 0;
      totalMinCost += min;
      totalMaxCost += max;
      roleCostBreakdown.push({
        title: role.title,
        market_range: `$${(min / 1000).toFixed(0)}K–$${(max / 1000).toFixed(0)}K`,
        min: min,
        max: max,
      });
    }
  });

  // Budget gap analysis
  const budgetGap = totalMinCost - budgetInfo.high;
  const budgetSufficient = budgetInfo.high >= totalMinCost;
  const budgetCoversFirst = budgetInfo.high >= (roleCostBreakdown[0]?.min || 0);

  // Equity trap analysis
  const equityTraps = [];
  const equityGuidance = [];

  if (stage === 'pre_seed' || stage === 'seed') {
    equityTraps.push({
      risk: 'Below-market cash + generous equity',
      severity: 'high',
      explanation: 'At pre-seed/seed, founders commonly offer 20-40% below market cash and compensate with equity. This works for co-founders, but for your first 3-5 hires, it creates three problems: (1) you attract candidates who couldn\'t get market-rate offers elsewhere, (2) top performers leave within 12 months when they realize the equity timeline is 4 years, (3) you build a culture of "discount talent" that compounds as you scale.',
      what_to_do: 'Pay at least 80% of market rate on cash. Use equity as an accelerant, not a substitute. A strong candidate at 85% cash + meaningful equity will outperform a weak candidate at 60% cash + larger equity 100% of the time.',
    });
    equityGuidance.push('Seed stage equity ranges: first 5 employees 0.5%-2.0%, employees 6-15: 0.1%-0.5%. These are guidelines — the specific amount should reflect the role\'s impact on company trajectory, not just seniority.');
  }

  if (stage === 'series_a') {
    equityTraps.push({
      risk: 'Using pre-Series A equity expectations at Series A prices',
      severity: 'medium',
      explanation: 'After raising a Series A, your equity is worth more per share — but many founders still grant equity as if it\'s seed stage. The result: you\'re either over-diluting (granting too many shares at higher valuations) or under-compensating (granting fewer shares without adjusting cash upward). Candidates at this stage are sophisticated enough to do the math.',
      what_to_do: 'Benchmark equity grants against post-Series A norms: VP-level hires get 0.2%-0.8%, senior ICs get 0.05%-0.25%. Pair this with competitive cash — at Series A, candidates expect 90-100% of market rate on base salary.',
    });
  }

  // Common traps regardless of stage
  equityTraps.push({
    risk: 'Hiring senior talent at mid-level compensation',
    severity: scores.hiring_urgency >= 4 ? 'critical' : 'medium',
    explanation: `You need senior-caliber people (based on your bottleneck severity of ${scores.execution_bottleneck_severity}/5), but your budget ${budgetSufficient ? 'may feel tight' : 'is significantly below'} market rates for those roles. The temptation is to hire a "senior" person at a mid-level price. In our experience across hundreds of placements, this hire fails 70% of the time — either the person isn't actually senior (they just had the title), or they are senior and leave within 6 months when they realize they\'re underpaid.`,
    what_to_do: budgetSufficient
      ? 'Your budget can cover market-rate talent. Don\'t leave money on the table by "saving" on comp — the cost of a bad hire at 80% market rate is 5x the savings.'
      : 'Consider fractional or part-time arrangements for senior roles rather than hiring full-time below market. A fractional VP at $15K/month for 6 months ($90K) delivers more value than a full-time mid-level hire at $150K/year who can\'t operate at the level you need.',
  });

  if (headcount >= 20 && scores.ai_readiness <= 2) {
    equityTraps.push({
      risk: 'Hiring humans for work AI should handle',
      severity: 'high',
      explanation: `With ${headcount} people and an AI readiness score of ${scores.ai_readiness}/5, you\'re likely about to hire 2-3 people for work that AI tooling could handle at 5% of the cost. Before adding headcount, audit which roles on your "to hire" list could be replaced or augmented by AI. Common examples: junior data entry/ops, basic content creation, first-line customer support, QA testing, report generation.`,
      what_to_do: 'Before every hire, ask: "Could an AI tool + a senior person do this job better than a new hire?" If yes, invest $5K-$20K in AI tooling instead of $100K+ in a new salary. Redirect the savings toward higher-leverage hires.',
    });
  }

  // Total cost modeling
  const costModel = {
    scenario_market_rate: {
      label: 'Market Rate (recommended)',
      total_annual: `$${(totalMinCost / 1000).toFixed(0)}K–$${(totalMaxCost / 1000).toFixed(0)}K`,
      per_role: roleCostBreakdown,
      verdict: 'Attracts A-players. Lowest risk of turnover. Highest probability of hitting 90-day milestones.',
    },
    scenario_below_market: {
      label: 'Below Market (15-25% discount)',
      total_annual: `$${((totalMinCost * 0.75) / 1000).toFixed(0)}K–$${((totalMaxCost * 0.85) / 1000).toFixed(0)}K`,
      risk_factors: [
        'Candidate quality drops significantly — you\'re competing with companies that pay market rate',
        'Average time-to-fill increases 40-60% (strong candidates have options)',
        'Turnover risk within 12 months: 50%+ (candidates take the job while job-hunting)',
        'Hidden cost: a $150K hire who leaves in 6 months costs $225K-$400K including recruiting, onboarding, and lost productivity',
      ],
      verdict: 'Appears cheaper but total cost of ownership is 2-3x higher when you factor in turnover, mis-hires, and delayed impact.',
    },
    scenario_fractional: {
      label: 'Fractional / Part-Time',
      total_annual: `$${((totalMinCost * 0.45) / 1000).toFixed(0)}K–$${((totalMaxCost * 0.55) / 1000).toFixed(0)}K`,
      best_for: 'Roles where you need 15-25 hours/week of senior expertise, not 40+ hours of junior execution. Ideal for: Head of Talent, Head of People, AI Ops Lead (early stage), Growth Lead (validation phase).',
      verdict: openToFractional
        ? 'You\'re open to fractional — this is the highest-ROI path for at least one of your three recommended roles.'
        : 'You indicated you\'re not open to fractional arrangements. Reconsider: fractional doesn\'t mean "less committed" — it means "senior talent at a price point you can actually afford."',
    },
  };

  // Budget verdict
  let budgetVerdict = '';
  if (budgetSufficient) {
    budgetVerdict = `Your stated budget (${budgetInfo.label}) can cover market-rate compensation for your recommended hires. This is a strong position — don't erode it by trying to "save" on comp. The companies that win talent wars at your stage are the ones that pay fairly and move fast.`;
  } else if (budgetCoversFirst) {
    budgetVerdict = `Your stated budget (${budgetInfo.label}) covers your first hire at market rate but falls short for all three recommended roles (total market rate: $${(totalMinCost / 1000).toFixed(0)}K–$${(totalMaxCost / 1000).toFixed(0)}K). Prioritize: make one great hire at market rate rather than three mediocre hires at a discount. Use fractional arrangements for roles 2 and 3.`;
  } else {
    budgetVerdict = `Your stated budget (${budgetInfo.label}) is significantly below market rates for the roles you need (total market rate: $${(totalMinCost / 1000).toFixed(0)}K–$${(totalMaxCost / 1000).toFixed(0)}K). This is a $${(budgetGap / 1000).toFixed(0)}K gap. You have three options: (1) raise the budget, (2) go fractional on all roles, or (3) make one hire at market rate and solve the other bottlenecks with AI tooling and process redesign.`;
  }

  return {
    budget_verdict: budgetVerdict,
    stated_budget: budgetInfo.label,
    market_rate_total: `$${(totalMinCost / 1000).toFixed(0)}K–$${(totalMaxCost / 1000).toFixed(0)}K`,
    budget_gap: budgetSufficient ? null : `$${(budgetGap / 1000).toFixed(0)}K shortfall`,
    equity_traps: equityTraps,
    equity_guidance: equityGuidance,
    cost_scenarios: costModel,
    bottom_line: scores.hiring_urgency >= 4
      ? 'You need to move fast, but speed is not an excuse to underpay. Every week you spend interviewing candidates who won\'t accept your offer is more expensive than the salary difference. Pay market rate, close in 2 weeks, and get to work.'
      : 'You have time to be strategic. Use it to build the right compensation packages — research your specific market, talk to 3-5 candidates before making an offer, and remember that the best candidates evaluate your offer against 2-4 others.',
  };
}

/**
 * Generate score interpretation — explain what each score means in context
 *
 * @param {Object} scores - Computed scores
 * @param {Object} responses - Survey responses
 * @returns {Object} Score interpretations
 */
function generateScoreInterpretation(scores, responses) {
  const headcount = parseInt(responses.headcount || '0', 10);
  const stage = responses.stage || 'seed';

  return {
    ai_readiness: {
      score: scores.ai_readiness,
      label: scores.ai_readiness <= 2 ? 'Early / Ad-hoc' : scores.ai_readiness <= 3 ? 'Emerging' : 'Systematized',
      interpretation: scores.ai_readiness <= 2
        ? `Your team is in the early stages of AI adoption. Individual contributors may be experimenting with tools like ChatGPT or Copilot, but there's no organizational strategy, no shared tooling, and no measurement of AI's impact on productivity. At ${headcount} people, this means you're leaving a 2-3x productivity multiplier on the table. Every competitor at your stage who systematizes AI before you will ship faster and operate leaner.`
        : scores.ai_readiness <= 3
          ? `Your team has pockets of AI adoption — some teams use it, others don't. The risk at this stage is "AI islands" where knowledge doesn't transfer. You need a unifying AI ops strategy that turns individual experiments into organizational capability.`
          : `Your AI adoption is ahead of most companies your size. The next step isn't more tools — it's measuring ROI and building AI into your hiring criteria so every new hire amplifies the advantage you've already built.`,
      benchmark: `Companies at ${stage} stage with ${headcount} people typically score 2-3 on AI readiness. ${scores.ai_readiness <= 2 ? 'You\'re at the low end — but that also means you have the highest upside from AI investment.' : scores.ai_readiness >= 4 ? 'You\'re ahead of the curve.' : 'You\'re in the middle of the pack.'}`,
    },
    role_clarity: {
      score: scores.role_clarity,
      label: scores.role_clarity <= 2 ? 'Critical Gap' : scores.role_clarity <= 3 ? 'Partial Clarity' : 'Well-Defined',
      interpretation: scores.role_clarity <= 2
        ? `This is your most urgent structural problem. When ownership of roadmap, growth, and AI is unclear or concentrated in one person, every initiative competes for the same decision-maker's bandwidth. At ${headcount} people, unclear ownership doesn't just slow you down — it creates invisible conflicts where teams optimize locally without knowing they're working against each other.`
        : scores.role_clarity <= 3
          ? `You have some ownership defined, but gaps remain. The risk is that your clear areas mask your unclear areas — the team functions well enough that nobody addresses the ambiguity until it causes a visible failure.`
          : `Ownership is well-distributed across roadmap, growth, and AI. This is a significant competitive advantage — most companies your size are still fighting over who owns what. Protect this by making ownership explicit in new hires' roles.`,
      benchmark: `Role clarity scores below 3 correlate with 40% longer decision cycles and 2x more "re-work" on cross-functional projects. Improving from ${scores.role_clarity} to 4+ typically saves 5-10 hours per week per senior leader.`,
    },
    execution_bottleneck_severity: {
      score: scores.execution_bottleneck_severity,
      label: scores.execution_bottleneck_severity <= 2 ? 'Manageable' : scores.execution_bottleneck_severity <= 3 ? 'Moderate' : 'Severe',
      interpretation: scores.execution_bottleneck_severity >= 4
        ? `Your bottlenecks are severe and compounding. The top bottleneck (${responses.bottleneck_1 || 'unspecified'}) isn't just slowing you down — it's distorting how your team spends time. When a bottleneck hits 4-5/5, teams unconsciously route around it, creating workarounds that add complexity without solving the root cause. Every month this persists, the fix gets more expensive.`
        : scores.execution_bottleneck_severity <= 2
          ? `Your bottlenecks are present but manageable. This is actually a good position — it means you can be strategic about which to address first rather than firefighting.`
          : `Your bottlenecks are moderate. The danger at this level is complacency — a 3/5 severity feels "fine" until it compounds over 2-3 quarters into something much harder to fix.`,
      benchmark: `Bottleneck severity of ${scores.execution_bottleneck_severity}/5 means your team is operating at approximately ${Math.round((1 - (scores.execution_bottleneck_severity - 1) * 0.12) * 100)}% of potential velocity. Resolving the primary bottleneck typically recovers 15-25% of lost productivity within 90 days.`,
    },
    leverage_opportunity: {
      score: scores.leverage_opportunity,
      label: scores.leverage_opportunity <= 2 ? 'Limited' : scores.leverage_opportunity <= 3 ? 'Moderate' : 'High',
      interpretation: scores.leverage_opportunity >= 4
        ? `This is where it gets exciting. A leverage score of ${scores.leverage_opportunity}/5 means you have significant room to increase output without proportionally increasing headcount. The combination of ${scores.ai_readiness <= 2 ? 'low AI adoption' : 'your current AI posture'} and your team structure means the right hire or tool investment could produce 3-5x returns. This is the core thesis of AI-era workforce design: scale leverage, not headcount.`
        : `Your leverage opportunity is ${scores.leverage_opportunity <= 2 ? 'limited right now — you may need to invest in foundational capabilities before leverage plays become available' : 'moderate — there are opportunities, but they require careful sequencing to capture'}.`,
      benchmark: `Leverage opportunity of ${scores.leverage_opportunity}/5 puts you in the ${scores.leverage_opportunity >= 4 ? 'top 20%' : scores.leverage_opportunity >= 3 ? 'middle 40%' : 'bottom 40%'} of companies at your stage for potential AI-driven productivity gains.`,
    },
    hiring_urgency: {
      score: scores.hiring_urgency,
      label: scores.hiring_urgency <= 2 ? 'Strategic / Can Wait' : scores.hiring_urgency <= 3 ? 'Active' : 'Urgent',
      interpretation: scores.hiring_urgency >= 4
        ? `The data says you need to hire soon — but "urgent" doesn't mean "careless." The biggest mistake teams make at high urgency is lowering their bar to fill the seat faster. A role that sits open for 6 weeks costs less than a bad hire that sits in the seat for 6 months. Move fast on sourcing and interviews, but don't compress your evaluation process.`
        : scores.hiring_urgency <= 2
          ? `You have time to be deliberate. Use this window to invest in AI tooling, process improvements, and role definition before you add headcount. The companies that hire best are the ones that know exactly what they need before they start looking.`
          : `Active hiring urgency means you should be in market now, but you can afford to be selective. Run a 4-6 week process with clear milestones: week 1-2 sourcing, week 3-4 interviews, week 5-6 offers.`,
      benchmark: `At your stage and budget, a typical hiring cycle takes ${scores.hiring_urgency >= 4 ? '3-5 weeks (expedited)' : '5-8 weeks (standard)'}. Factor this into your milestone planning.`,
    },
  };
}

/**
 * Generate executive briefing — the 2-minute version for board decks and leadership meetings
 *
 * @param {Object} responses - Survey responses
 * @param {Object} scores - Computed scores
 * @param {string} archetype - Team archetype
 * @param {string} hiringPosture - Hiring posture
 * @param {Array} recommendedRoles - Recommended roles
 * @returns {Object} Executive briefing
 */
function generateExecutiveBriefing(responses, scores, archetype, hiringPosture, recommendedRoles) {
  const headcount = parseInt(responses.headcount || '0', 10);
  const stage = responses.stage || 'seed';
  const companyName = responses.company_name || 'Your company';
  const objective = responses.primary_objective || '';
  const milestone = responses.six_month_milestone || 'your next growth milestone';

  const objectiveLabels = {
    ship_product_faster: 'accelerating product delivery',
    improve_conversion_growth: 'building a repeatable growth engine',
    reduce_operating_costs: 'reducing operating costs through AI and automation',
    add_ai_features: 'integrating AI into the product',
    improve_customer_support_efficiency: 'improving customer support efficiency',
    prepare_for_scale_leadership: 'preparing leadership for scale',
  };

  const stageLabels = {
    pre_seed: 'Pre-Seed',
    seed: 'Seed',
    series_a: 'Series A',
    profitable_smb: 'Profitable SMB',
    growth: 'Growth',
  };

  const roleList = recommendedRoles.map((r) => r.title).join(', ');

  return {
    one_liner: `${companyName} is a ${headcount}-person ${stageLabels[stage] || stage} company classified as a "${archetype}." The primary objective is ${objectiveLabels[objective] || objective}, with a 6-month milestone of: ${milestone}. Current hiring posture: ${hiringPosture}.`,
    situation: `${companyName} has ${headcount} employees at ${stageLabels[stage] || stage} stage. AI readiness is ${scores.ai_readiness}/5 (${scores.ai_readiness <= 2 ? 'early adoption — significant upside available' : scores.ai_readiness <= 3 ? 'emerging — needs systematization' : 'ahead of peers'}). Role clarity is ${scores.role_clarity}/5 (${scores.role_clarity <= 2 ? 'critical gap — ownership is unclear or concentrated' : 'functional but with blind spots'}). Execution bottleneck severity is ${scores.execution_bottleneck_severity}/5 (${scores.execution_bottleneck_severity >= 4 ? 'severe — compounding daily' : 'manageable with targeted intervention'}).`,
    recommendation: `${hiringPosture === 'do not hire yet; redesign workflow first' ? 'Pause all hiring. Redesign workflows and implement AI tooling before adding headcount. Then hire: ' : hiringPosture === 'build internal AI ops before adding headcount' ? 'Before hiring, invest in AI operations infrastructure. Then hire: ' : 'Proceed with hiring in priority order: '}${roleList}.`,
    risk_if_no_action: `Without intervention, the primary bottleneck (${responses.bottleneck_1 || 'unidentified'}) will continue to compound. At current trajectory, ${companyName} risks: (1) missing the 6-month milestone by 2-4 months, (2) burning $${(headcount * 8000 / 1000).toFixed(0)}K-$${(headcount * 12000 / 1000).toFixed(0)}K in annual productivity loss from unresolved bottlenecks, and (3) falling behind AI-native competitors who are achieving 2-3x more output per employee.`,
    board_ready_summary: `The diagnostic recommends a "${hiringPosture}" approach. Key scores: AI Readiness ${scores.ai_readiness}/5, Role Clarity ${scores.role_clarity}/5, Bottleneck Severity ${scores.execution_bottleneck_severity}/5, Leverage Opportunity ${scores.leverage_opportunity}/5, Hiring Urgency ${scores.hiring_urgency}/5. Priority hires: ${roleList}. Estimated total compensation investment: $${recommendedRoles.reduce((sum, r) => sum + (r.compensation?.total_comp_range?.low || 0), 0) / 1000}K–$${recommendedRoles.reduce((sum, r) => sum + (r.compensation?.total_comp_range?.high || 0), 0) / 1000}K annually.`,
  };
}

/**
 * Main function: Generate complete assessment from survey responses
 *
 * @param {Object} allResponses - Merged object containing all survey step responses
 * @returns {Object} Complete diagnostic assessment
 */
export function generateAssessment(allResponses) {
  // Compute all scores
  const scores = {
    ai_readiness: scoreAiReadiness(allResponses),
    role_clarity: scoreRoleClarity(allResponses),
    execution_bottleneck_severity: scoreExecutionBottleneckSeverity(allResponses),
    leverage_opportunity: 0, // Set after ai_readiness
    hiring_urgency: scoreHiringUrgency(allResponses),
  };

  scores.leverage_opportunity = scoreLeverageOpportunity(allResponses, scores.ai_readiness);

  // Determine team archetype
  const teamArchetype = determineArchetype(allResponses, scores);

  // Determine hiring posture
  const hiringPosture = determineHiringPosture(allResponses, scores);

  // Generate recommended roles
  const recommendedRoles = generateRecommendedRoles(allResponses, scores);

  // Generate diagnosis
  const diagnosis = generateDiagnosis(allResponses, scores, teamArchetype);

  // Generate hiring roadmap
  const hireNowLaterAvoid = generateHireNowLaterAvoid(allResponses, scores, hiringPosture, recommendedRoles);

  // Generate org shape
  const orgShape = generateOrgShape(allResponses, scores);

  // Generate 3-month roadmap
  const roadmap = generateRoadmap(allResponses, scores, recommendedRoles);

  // Determine CTA
  const cta = determineCTA(allResponses, scores, hiringPosture);

  // NEW: Generate score interpretations
  const scoreInterpretation = generateScoreInterpretation(scores, allResponses);

  // NEW: Generate budget risk analysis
  const budgetRisk = generateBudgetRiskAnalysis(allResponses, scores, recommendedRoles);

  // NEW: Generate executive briefing
  const executiveBriefing = generateExecutiveBriefing(allResponses, scores, teamArchetype, hiringPosture, recommendedRoles);

  // Return complete assessment — McKinsey-grade output
  return {
    // Executive briefing — the 2-minute version
    executive_briefing: executiveBriefing,

    // Scores with deep interpretation
    scores,
    score_interpretation: scoreInterpretation,

    // Strategic classification
    team_archetype: teamArchetype,
    hiring_posture: hiringPosture,

    // Full role briefs with compensation intelligence
    recommended_roles: recommendedRoles.map((role) => ({
      title: role.title,
      why_now: role.why_now,
      strategic_rationale: role.strategic_rationale || null,
      problem_it_solves: role.problem_it_solves,
      ninety_day_outcomes: role.ninety_day_outcomes,
      person_to_avoid: role.person_to_avoid,
      interview_signals: role.interview_signals || [],
      compensation: role.compensation || null,
      leverage_score: role.leverage_score,
      time_to_impact: role.time_to_impact,
      cost_efficiency: role.cost_efficiency,
    })),

    // Organizational diagnosis
    diagnosis,

    // Budget and compensation risk analysis
    budget_risk_analysis: budgetRisk,

    // Hiring matrix
    hire_now_later_avoid: hireNowLaterAvoid,

    // Org structure recommendations
    org_shape: orgShape,

    // 90-day execution roadmap
    roadmap,

    // Call to action
    cta,

    // Metadata
    _meta: {
      generated_at: new Date().toISOString(),
      model_version: '2.0.0',
      methodology: 'Human in the Loop Talent AI-Era Hiring Diagnostic — deterministic scoring engine built on workforce architecture patterns observed across 500+ company assessments. Compensation data sourced from Wellfound, TopStartups.io, Levels.fyi, and Glassdoor (2026 data).',
      disclaimer: 'This assessment is generated by a deterministic scoring engine based on self-reported inputs. It is not a substitute for professional HR, legal, or financial advice. Compensation ranges reflect market data as of April 2026 and vary by location, industry, and specific candidate qualifications.',
    },
  };
}

// Nexus: Neo4j Graph Schema — Constraints, Indexes & Relationships
// Run via Neo4j Browser or cypher-shell

// ============================================================
// CONSTRAINTS — ensure data integrity
// ============================================================

// Unique constraints (also create implicit indexes)
CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:User) REQUIRE u.user_id IS UNIQUE;

CREATE CONSTRAINT company_id_unique IF NOT EXISTS
FOR (c:Company) REQUIRE c.company_id IS UNIQUE;

CREATE CONSTRAINT skill_name_unique IF NOT EXISTS
FOR (s:Skill) REQUIRE s.name IS UNIQUE;

CREATE CONSTRAINT job_id_unique IF NOT EXISTS
FOR (j:Job) REQUIRE j.job_id IS UNIQUE;

CREATE CONSTRAINT startup_id_unique IF NOT EXISTS
FOR (st:Startup) REQUIRE st.startup_id IS UNIQUE;

// ============================================================
// INDEXES — optimize traversal and lookup
// ============================================================

CREATE INDEX user_name_idx IF NOT EXISTS
FOR (u:User) ON (u.full_name);

CREATE INDEX user_industry_idx IF NOT EXISTS
FOR (u:User) ON (u.industry);

CREATE INDEX user_location_idx IF NOT EXISTS
FOR (u:User) ON (u.country_code);

CREATE INDEX company_name_idx IF NOT EXISTS
FOR (c:Company) ON (c.name);

CREATE INDEX company_industry_idx IF NOT EXISTS
FOR (c:Company) ON (c.industry);

CREATE INDEX skill_category_idx IF NOT EXISTS
FOR (s:Skill) ON (s.category);

CREATE INDEX job_title_idx IF NOT EXISTS
FOR (j:Job) ON (j.title);

// ============================================================
// RELATIONSHIP TYPES (documented — Neo4j creates on first use)
// ============================================================

// (:User)-[:CONNECTED_TO {connected_at, strength_score, mutual_context}]->(:User)
// (:User)-[:FOLLOWS {since}]->(:User)
// (:User)-[:WORKS_AT {from, to, title, is_current}]->(:Company)
// (:User)-[:HAS_SKILL {level, verified, years}]->(:Skill)
// (:User)-[:MENTORS {since, focus_area}]->(:User)
// (:User)-[:INVESTED_IN {amount_range, date, round}]->(:Startup)
// (:User)-[:FOUNDED]->(:Startup)
// (:Company)-[:HAS_DEPARTMENT {name, headcount}]->(:Department)
// (:Job)-[:POSTED_BY]->(:Company)
// (:Job)-[:REQUIRES_SKILL {importance}]->(:Skill)

// ============================================================
// SAMPLE QUERIES for common patterns
// ============================================================

// --- Friend-of-Friend Suggestions (max 3 hops) ---
// MATCH (me:User {user_id: $userId})-[:CONNECTED_TO*2..3]-(suggestion:User)
// WHERE NOT (me)-[:CONNECTED_TO]-(suggestion)
//   AND me <> suggestion
//   AND NOT EXISTS { MATCH (me)-[:CONNECTED_TO {status: 'blocked'}]-(suggestion) }
// WITH suggestion, count(*) AS mutual_connections
// ORDER BY mutual_connections DESC
// LIMIT 20
// RETURN suggestion.user_id AS suggested_id,
//        suggestion.full_name AS name,
//        suggestion.headline AS headline,
//        mutual_connections

// --- Skill Overlap Score between two users ---
// MATCH (u1:User {user_id: $userId1})-[:HAS_SKILL]->(s:Skill)<-[:HAS_SKILL]-(u2:User {user_id: $userId2})
// WITH count(s) AS shared_skills,
//      [(u1)-[:HAS_SKILL]->(s1:Skill) | s1] AS skills1,
//      [(u2)-[:HAS_SKILL]->(s2:Skill) | s2] AS skills2
// RETURN shared_skills,
//        size(skills1) AS user1_skills,
//        size(skills2) AS user2_skills,
//        toFloat(shared_skills) / size(apoc.coll.union(skills1, skills2)) AS jaccard_similarity

// --- Warm Introduction Path ---
// MATCH path = shortestPath(
//   (me:User {user_id: $userId})-[:CONNECTED_TO*..3]-(target:User {user_id: $targetId})
// )
// RETURN [n IN nodes(path) | {id: n.user_id, name: n.full_name}] AS path_nodes,
//        length(path) AS hops,
//        [r IN relationships(path) | r.strength_score] AS connection_strengths

1.1 Profile Anchors (7 Core Entities)
1. project_profiles
2. product_profiles
3. amc_profiles
4. complaint_profiles
5. job_profiles
6. site_visit_schedule
7. info_profiles
Junction / Supporting Tables:
• profile_mapping (enquiry → profile link)
• profile_to_profile_links (cross-links between profiles)
DOCUMENTATION SCOPE
This document focuses on:
• Cross-Profile & System Core Modules
(profile_mapping, profile_to_profile_links, team_user_map, and the 7 profile entities)
• How all modules interact via these core components.
DELIVERABLE 1 – DATABASE SCHEMA TABLE
Key Tables in Cross-Profile & System Core
1. profile_mapping
Purpose: Links an enquiry to a profile type (project, product, etc.).
Attributes:
• mapping_id (PK)
• enquiry_id (FK)
• profile_type (enum: project, product, amc, complaint, info, job, site_visit)
• profile_id (FK)
• created_by, created_at, updated_at
Relationships:
• Many enquiries can be mapped to one profile.
• One profile can be mapped from multiple enquiries (e.g., linked enquiries).
2. profile_to_profile_links
Purpose: Creates cross-links between different profiles (e.g., Complaint → AMC).
Attributes:
• link_id (PK)
• source_profile_type
• source_profile_id
• target_profile_type
• target_profile_id
• relationship_type (enum: parent, dependent, related, follow-up)
• created_by, created_at
Relationships:
• Many-to-many between any profiles.
3. team_user_map
Purpose: Manages user assignments across multiple teams (cross-functional).
Attributes:
• map_id (PK)
• user_id (FK)
• team_id (FK)
• role_within_team (enum)
• active_flag
4. Audit & Notification Tables (support)
• user_activity_log – Logs actions by user across profiles.
• notification_log – For real-time notifications linked to profiles.
5. 7 Profile Anchor Tables
• project_profiles
• product_profiles
• amc_profiles
• complaint_profiles
• job_profiles
• site_visit_schedule
• info_profiles
(Attributes for these were already documented earlier – they are considered core here.)
DELIVERABLE 2 – BUSINESS WORKFLOW
Core Workflow Logic:
1. Enquiry Stage
o Lead enters the system
o profile_mapping determines destination profile.
2. Profile Creation
o Depending on type:
▪ project_profiles (EPC)
▪ product_profiles (AI sales)
▪ amc_profiles (service)
▪ complaint_profiles (issue logging)
▪ job_profiles (HR pipeline)
▪ site_visit_schedule (inspection/technical visit)
▪ info_profiles (document request)
3. Cross-Linking
o profile_to_profile_links connects profiles:
▪ Complaint → AMC
▪ AMC → Project
▪ Info → Product
4. Team Assignment
o team_user_map assigns responsibility.
5. Notifications & Triggers
o Task creation, approvals, escalation.
DELIVERABLE 3 – UI WIREFRAMES / MOCKUPS
Screens:
1. Profile Dashboard – Summary of all profiles with filters.
2. Profile Detail Page – Shows linked enquiries, links to other profiles, actions.
3. Cross-Link Builder – UI to create links between profiles.
4. Team Assignment Panel – Add/Remove users to teams for profiles.
5. Notification Center – Shows real-time alerts tied to profiles.
(Figma mockups recommended for detailed layouts.)
DELIVERABLE 4 – ERD DIAGRAM
Key Entities:
ENQUIRIES --< profile_mapping >-- (project_profiles/product_profiles/…)
profile_to_profile_links: (source_profile, target_profile)
team_user_map: (user ↔ team)
This ERD shows:
• Many-to-many connections between profiles
• One-to-many mapping from enquiries to profiles
DELIVERABLE 5 – SOP DOCUMENT
Standard Operating Procedures:
• Create Profile:
o User selects type, system auto-fills base details from enquiry.
• Link Profiles:
o Use Cross-Link UI → choose relationship → save.
• Assign Team:
o Manager selects team members using team_user_map.
• Audit and Notifications:
o Each action triggers a notification and is logged.
DELIVERABLE 6 – DEVELOPER TASK LIST (JIRA-STYLE)
Sample Sprint Breakdown:
Sprint 1 – Backend
• API for profile_mapping CRUD
• API for profile_to_profile_links CRUD
• Team-user assignment service
Sprint 2 – Frontend
• Profile Dashboard UI
• Cross-Link Builder UI
• Notification Center UI
Sprint 3 – Automation
• Triggers for notifications
• Cross-profile linking logic
• Audit log integration
DELIVERABLE 7 – UI WALKTHROUGH
Step-by-Step Screen Navigation:
1. Login → Dashboard → Profiles List
2. Click profile → Profile Detail → Linked Profiles & Actions
3. Use Cross-Link button → Create new link
4. Open Team Assignment Panel → Assign users
DELIVERABLE 8 – AUTOMATION RULES + TRIGGER CONDITIONS
Examples:
• Rule 1: If a Complaint Profile is linked to a Project → Auto-notify AMC owner.
• Rule 2: If a site_visit_schedule is overdue → Auto-remind assigned engineer.
• Rule 3: If an AMC profile is 30 days from expiry → Auto-generate renewal task.
DELIVERABLE 9 – ROLE-WISE SYSTEM INTERACTIONS
Admin:
• Manage profiles, mappings, links, teams.
Telecaller:
• View profiles linked to their enquiries, create links.
Manager:
• Assign team members, approve links.
Finance:
• View linked profiles for billing.
Engineer/Field Team:
• View assigned site_visit_schedule and linked project.
DELIVERABLE 10 – SUMMARY TABLE OF MODULES + FEATURES
Module Key Features
profile_mapping Enquiry → Profile linkage
profile_to_profile Cross-link profiles
Module Key Features
team_user_map Multi-team user assignment
notification_log Real-time alerts
user_activity_log Full action history
DELIVERABLE 11 – FINAL STATUS AND STAGE MAPPING
Stages:
• New → Mapped → Linked → Assigned → In Progress → Closed/Completed
DELIVERABLE 12 – REAL-TIME INTERACTION COMPONENTS
• Chat: Linked to profiles
• Notification Engine: Real-time push for changes
• Approval Engine: Workflow approvals on linking
DELIVERABLE 13 – MODULE & SUB-MODULE MAPPING
Cross-Profile & Core
│
├── profile_mapping
├── profile_to_profile_links
├── team_user_map
├── notification_log
└── user_activity_log
DELIVERABLE 14 – KPI AND PERFORMANCE METRICS HANDLING
• Tracks how quickly profiles are linked and actions taken.
• KPIs for team response times and assignment closures.
DELIVERABLE 15 – TECHNICAL SPEC DOCUMENT
APIs:
• /profile_mapping
• /profile_links
• /teams/assign
• /notifications
Integrations:
• Authentication
• Third-party analytics tools
DELIVERABLE 16 – MINDMAPS / FLOWCHARTS
Flow:
Enquiry → profile_mapping → Profile → profile_to_profile_links → Notifications/Assignment → Workflows
CROSS-PROFILE & SYSTEM CORE
|
├── 1. profile_mapping
| ├── Purpose: Enquiry → Profile link
| ├── Links: enquiries table to any profile
| └── Attributes: mapping_id, enquiry_id, profile_type, profile_id, created_at
|
├── 2. profile_to_profile_links
| ├── Purpose: Cross-links between profiles
| ├── Examples:
| | Complaint -> AMC
| | AMC -> Project
| | Info -> Product
| └── Attributes: link_id, source_profile_type, target_profile_type, relationship_type
|
├── 3. team_user_map
| ├── Purpose: Assign users to multiple teams
| └── Attributes: map_id, user_id, team_id, role_within_team
|
├── 4. Notifications
| ├── notification_log (real-time alerts)
| └── user_activity_log (audit trail)
|
└── 5. 7 Profiles (Anchors)
 ├── project_profiles
 ├── product_profiles
 ├── amc_profiles
 ├── complaint_profiles
 ├── job_profiles
 ├── site_visit_schedule
 └── info_profiles
Flow:
Enquiry -> profile_mapping -> Profile
Profile <-> profile_to_profile_links -> Other Profiles
Team Assignment (team_user_map)
↓
Notifications + Activity Logs



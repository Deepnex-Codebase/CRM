/ ENQUIRY MANAGEMENT
Purpose: Capturing and managing all leads and enquiries.
Tables:
• enquiries
• status_log
• assignment_log
• tasks
• communication_log
• notification_log
• call_list / call_log / call_feedback
• profile_mapping
• integration_configs
• audit_log
Reference Tables:
source_channels, profile_types, status_types, priority_score_types, assignment_rules, automation_rules,
dashboard_configs, kpi_scores, notification_templates, action_types, role_types, ,report_logs
8. Output: Decides which Profile (Project / Product / AMC / Info / site_visit_schedule / complaint / Job
) the enquiry converts into.
1. DATABASE SCHEMA TABLE
The CRM/Enquiry Management system is responsible for capturing, qualifying, assigning, and tracking enquiries from
multiple channels.
Core Tables
1. enquiries
Purpose: Main table capturing all leads and enquiries.
Key Attributes:
• enquiry_id (PK)
• enquiry_date (datetime)
• source_channel_id (FK)
• customer_name
• contact_number
• email
• enquiry_type (enum: project, product, service, info)
• status_id (FK to status_types)
• priority_score
• assigned_user_id
• assigned_team_id
• remarks
• created_by / created_at / updated_by / updated_at
2. status_log
• Tracks all status transitions of an enquiry.
• Attributes: status_log_id, enquiry_id, old_status, new_status, changed_by, timestamp.
3. assignment_log
• History of assignments and reassignments of an enquiry.
4. tasks
• Tasks created from enquiries.
• Attributes: task_id, enquiry_id, task_title, due_date, assigned_to.
5. communication_log
• Captures all email/SMS/WhatsApp/phone interactions for an enquiry.
6. notification_log
• Stores notifications triggered for enquiries (system-level).
7. call_list, call_log, call_feedback
• call_list: Scheduled calls for telecallers.
• call_log: Logs of outbound calls.
• call_feedback: Call outcome and notes.
8. audit_log
• Immutable logs of every change.
9. integration_configs
• Stores configurations for external integrations (JustDial, IndiaMart, LinkedIn, etc.)
Reference Tables
• source_channels: Master of lead sources.
• status_types: New, In Progress, Qualified, Converted, Closed.
• priority_score_types: Lead scoring types.
• assignment_rules: For automatic user/team assignment.
• automation_rules: Trigger actions based on conditions.
Relationships
• enquiries 1:M status_log
• enquiries 1:M assignment_log
• enquiries 1:M tasks
• enquiries 1:M communication_log
• enquiries 1:M call_log
• enquiries → profile_mapping (1:1 or 1:M)
2. BUSINESS WORKFLOW
Workflow Steps:
1. Lead Capture
o Leads come from digital channels, integrations, imports, manual entry.
2. Validation
o Deduplication check.
o Contact verification.
3. Classification
o Enquiry type (project, product, info, AMC, complaint).
4. Scoring
o AI assigns priority_score based on source, history, and channel.
5. Assignment
o Auto-assign using assignment_rules or manual by manager.
6. Follow-up
o Tasks, calls, and communication logs updated.
7. Conversion / Closure
o If qualified: Converted → creates a profile in profile_mapping.
o If unqualified: Closed (Lost/Dropped).
Approval / Trigger Flows
• Auto-assignment notifications.
• SLA reminders for follow-up tasks.
• Trigger profile creation once “Converted”.
3. UI WIREFRAMES / MOCKUPS
Screens:
1. Enquiry Dashboard
o Filter by status, channel, assigned team.
2. Enquiry Detail View
o Shows contact info, history, communication logs.
3. Task Panel
o Inline creation of tasks.
4. Activity Timeline
o Chronological view of all actions.
5. Conversion Wizard
o Steps for profile conversion.
4. ERD DIAGRAM (Simplified)
lua
CopyEdit
enquiries --< status_log
 --< assignment_log
 --< tasks
 --< communication_log
 --< call_log
 --< notification_log
 --< profile_mapping
5. SOP DOCUMENT
Standard Operating Procedures:
• Lead Entry: Manual or automated.
• Qualification: Verify details and classify.
• Assignment: Automatically assigned or manually by manager.
• Follow-up: Use tasks, calls, communication logs.
• Closure/Conversion: Convert to profile or close enquiry.
6. DEVELOPER TASK LIST (JIRA-STYLE)
Sprint 1: Core APIs
• CRUD for enquiries
• Assignment and status logs
• Task management endpoints
Sprint 2: Automation
• Implement SLA triggers
• Notification services
Sprint 3: Integrations
• External lead integrations (JustDial, IndiaMart)
7. UI WALKTHROUGH (Screen by Screen)
1. Enquiry Dashboard → Search & Filters
2. Click Enquiry → Detail View → Contact/Status/History
3. Assign / Update Status → Inline Action
4. Convert → Launch Conversion Wizard (choose profile type)
8. AUTOMATION RULES + TRIGGER CONDITIONS
• Auto-assignment Rule: Assign to user based on region/channel.
• Notification Rule: Notify assigned user when a lead is created.
• Escalation Rule: If no update within SLA, escalate to manager.
9.
 ROLE-WISE SYSTEM INTERACTIONS
• Telecaller: Create, update, call logs, tasks.
• Manager: Assign, reassign, monitor KPIs.
• Admin: Configure rules, view all data.
• Integration Bot: Import leads.
10. SUMMARY TABLE OF MODULES + FEATURES
Sub-module Key Features
Enquiries Capture, classify, assign
Assignment Logs Auto/manual assignment history
Status Logs History of status transitions
Communication Email, SMS, WhatsApp tracking
Conversion Profile creation from qualified leads
11. FINAL STATUS AND STAGE MAPPING
• Stage: New → Validated → Assigned → Follow-Up → Converted or Closed
12. REAL-TIME INTERACTION COMPONENTS
• Chat window embedded in enquiry detail page.
• Notifications for new assignments.
• Auto-suggestions from AI.
13. MODULE & SUB-MODULE MAPPING
pgsql
CopyEdit
CRM / Enquiry Management
├── Enquiries
│ ├── Status Log
│ ├── Assignment Log
│ ├── Tasks
│ ├── Communication Log
│ ├── Call Log
│ └── Conversion (profile_mapping)
14. KPI AND PERFORMANCE METRICS HANDLING
• Lead conversion rate
• Average response time
• SLA compliance %
• Follow-up efficiency
15. TECHNICAL SPEC DOCUMENT
REST APIs:
• /enquiries
• /tasks
• /status_log
• /assignment
• /conversion
Integrations:
• Email gateways
• WhatsApp API
• Lead import APIs
16. MINDMAPS OR FLOWCHARTS
pgsql
CopyEdit
Lead Capture
 -> Deduplication
 -> Qualification
 -> Assignment
 -> Follow-up
 -> Conversion (Profile) or Closure
CRM / ENQUIRY MANAGEMENT – FLOW
pgsql
CopyEdit
Lead Sources
├── Web Forms
├── WhatsApp / Email
├── Campaigns
├── External Portals (JustDial / IndiaMart)
└── Manual Entry
 |
 v
 +----------------+
 | ENQUIRIES |
 +----------------+
 |
 | (Deduplication, Validation, AI Scoring)
 v
 +------------------------+
 | Assignment Engine |
 +------------------------+
 |
 +---> assignment_log
 +---> notification_log
 |
 v
 +----------------+
 | Follow-up Stage|
 +----------------+
 | | |
 | | +-> communication_log
 | +-> call_log / call_feedback
 +-> tasks
 |
 v
 +------------------------+
 | Conversion / Closure |
 +------------------------+
 |
 +---> profile_mapping (to create profile)
 |
 +---> Closed (Lost/Drop)
Data Entities Involved:
• enquiries
• status_log
• assignment_log
• tasks
• communication_log
• notification_log
• call_list / call_log / call_feedback
• profile_mapping
Relationships:
enquiries --< status_log
 --< assignment_log
 --< tasks
 --< communication_log
 --< call_log
 --< notification_log
 --< profile_mapping (Conversion)

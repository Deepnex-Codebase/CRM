7. 
INFO_PROFILES MODULE
Purpose: Information and document requests.
Key Tables:
• info_profiles
• info_actions
• info_responses
• info_attachments
• info_sla_rules
• info_feedback
1. DATABASE SCHEMA TABLE
Core Tables
1. info_profiles
Purpose: Master table for all information/document requests.
Attributes:
• info_id (PK)
• linked_enquiry_id (optional)
• customer_id (FK)
• request_type (Brochure, Policy, Invoice Copy, Catalog)
• request_channel (Website, Email, WhatsApp, Internal)
• priority
• assigned_user_id
• status_id (FK → info_status)
• requested_on
• fulfilled_on
• created_at, updated_at
2. info_actions
• Tracks actions taken on each info request (document upload, email sent).
3. info_responses
• System or user responses and final resolution logs.
4. info_attachments
• Uploaded documents/files related to the request.
5. info_feedback
• Post-closure customer feedback.
6. info_audit_log
• Tracks assignment, status changes, SLA.
Reference Tables
• info_status
• info_types
Relationships
lua
CopyEdit
info_profiles
 |--< info_actions
 |--< info_responses
 |--< info_attachments
 |--< info_feedback
 |--< info_audit_log
2. BUSINESS WORKFLOW
Workflow Stages
1. Capture Request
o Source: Website form, WhatsApp, Email, Manual.
2. Categorization
o Auto-tag type (catalog, invoice, training material).
3. Assignment
o Assign to correct department (Sales, Accounts, HR, etc.).
4. Fulfillment
o Provide requested document/info.
5. Feedback & Closure
o Customer feedback recorded.
Trigger Points
• Auto-response acknowledging receipt.
• SLA timers for requests pending.
3. UI WIREFRAMES / MOCKUPS
Screens:
1. Info Request Dashboard
o Filters by type, priority, SLA.
2. Info Profile Detail View
o Tabs: Overview | Actions | Responses | Attachments.
3. Response Submission Panel
o Upload document, send via WhatsApp/email.
4. ERD DIAGRAM
lua
CopyEdit
info_profiles
 |
 |--< info_actions
 |--< info_responses
 |--< info_attachments
 |--< info_feedback
 |--< info_audit_log
5. SOP DOCUMENT
Standard Operating Procedure:
• Step 1: Info request logged from source.
• Step 2: Auto-categorize type.
• Step 3: Assign to user/department.
• Step 4: Fulfill request (send document).
• Step 5: Close request after feedback.
6. DEVELOPER TASK LIST (JIRA-style)
Sprint 1 – Backend:
• CRUD APIs for info_profiles.
• SLA tracking.
Sprint 2 – Frontend:
• Dashboard UI.
• Request fulfillment forms.
Sprint 3 – Automation:
• Auto-tagging engine.
• Notifications.
7. UI WALKTHROUGH (Screen by Screen)
1. Dashboard → Create Info Request
2. Assign Department/User
3. Upload Response or Document
4. Send to Customer
5. Close after Feedback
8. AUTOMATION RULES + TRIGGER CONDITIONS
• Rule 1: SLA notifications for overdue requests.
• Rule 2: Auto-classify request type using AI.
• Rule 3: Auto-response confirmation to customer.
9.
 ROLE-WISE SYSTEM INTERACTIONS
• Sales/Marketing: Handles catalog/brochure requests.
• Accounts: Handles invoice/document requests.
• Admin: Manage request types, SLA rules.
10. SUMMARY TABLE OF MODULES + FEATURES
Sub-Module Features
Info Profiles Tracks all document/information requests
Actions & Responses Logs actions taken
Attachments Document storage and sharing
Feedback Collect satisfaction after closure
11. FINAL STATUS AND STAGE MAPPING
• Status: New → Assigned → Fulfilled → Closed
12. REAL-TIME INTERACTION COMPONENTS
• Notifications for SLA deadlines.
• Integrated email/WhatsApp for sharing.
• Chat with requester.
13. MODULE & SUB-MODULE MAPPING
pgsql
CopyEdit
Info Profiles
├── Actions
├── Responses
├── Attachments
├── Feedback
└── Audit Log
14. KPI AND PERFORMANCE METRICS HANDLING
• SLA compliance for requests
• Response time
• Customer satisfaction
15. TECHNICAL SPEC DOCUMENT
APIs:
• /info_profiles
• /info_responses
• /info_feedback
Integrations:
• WhatsApp API
• Email system
16. MINDMAP / FLOWCHART
Info Request Capture
 -> Classification
 -> Assignment
 -> Fulfillment
 -> Feedback & Closure

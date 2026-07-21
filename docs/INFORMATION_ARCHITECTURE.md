# Nexus HR — Information Architecture

```
Nexus HR
├── Auth
│   ├── Login
│   ├── Register (Company + Admin)
│   ├── Forgot Password
│   ├── Reset Password
│   ├── 2FA Setup/Verify
│   └── OAuth (Google, Microsoft)
│
├── Dashboard (Home)
│   ├── KPI Cards
│   ├── AI Insights
│   ├── Charts & Heatmaps
│   ├── Quick Actions
│   ├── Calendar Widget
│   └── Activity Feed
│
├── People
│   ├── Employees
│   │   ├── Directory
│   │   ├── Profile (360° view)
│   │   └── Timeline
│   └── Organization
│       ├── Departments
│       ├── Teams
│       ├── Branches
│       ├── Job Titles
│       ├── Cost Centers
│       └── Org Chart
│
├── Time & Attendance
│   ├── Dashboard
│   ├── Check-in/out
│   ├── Shifts
│   ├── Corrections
│   └── Reports
│
├── Leave
│   ├── My Leave
│   ├── Team Calendar
│   ├── Approvals
│   ├── Holidays
│   └── Policies
│
├── Payroll
│   ├── Salary Structures
│   ├── Processing
│   ├── Payslips
│   ├── Bonuses & Allowances
│   ├── Tax / PF / ESI
│   ├── Loans & Advances
│   └── Reports
│
├── Talent
│   ├── Recruitment
│   │   ├── Job Postings
│   │   ├── Candidates
│   │   ├── Pipeline
│   │   └── Offers
│   ├── Performance
│   │   ├── Goals & OKRs
│   │   ├── Reviews (360°)
│   │   └── Analytics
│   └── Training
│       ├── Courses
│       ├── Learning Paths
│       └── Certificates
│
├── Operations
│   ├── Documents
│   ├── Assets
│   ├── Helpdesk
│   └── Projects
│
├── Analytics
│   ├── Workforce
│   ├── Attendance
│   ├── Leave
│   ├── Payroll
│   ├── Recruitment
│   └── Custom Reports
│
├── AI Assistant
│   └── Chat + Actions
│
├── Workflows
│   └── Builder (Drag & Drop)
│
├── Calendar
│
├── Notifications
│
└── Settings
    ├── Company Profile
    ├── Branding
    ├── Roles & Permissions
    ├── Integrations
    ├── Email/SMS Templates
    ├── Webhooks & API Keys
    └── Admin Panel
        ├── Users
        ├── Audit Logs
        ├── Security
        └── Backup
```

## Navigation Model

- **Primary sidebar**: Module groups (collapsible)
- **Top bar**: Global search, notifications, AI, theme toggle, profile
- **Command palette** (⌘K): Universal actions + search
- **Breadcrumbs**: Context within deep modules
- **Mobile**: Bottom nav + hamburger drawer

## Permission Scopes

| Scope | Description |
|-------|-------------|
| `company:*` | Full company access |
| `department:{id}` | Department-scoped |
| `team:{id}` | Team-scoped |
| `self` | Own data only |

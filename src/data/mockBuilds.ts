
import { Build } from "@/components/BuildCard"

export const mockBuilds: Build[] = [
  {
    id: "1",
    jobName: "frontend-deployment",
    buildNumber: 142,
    status: "SUCCESS",
    startTime: "2024-07-03T10:30:00Z",
    duration: 245,
    author: "max.mueller@company.com",
    branch: "main",
    url: "http://jenkins.company.com/job/frontend-deployment/142/"
  },
  {
    id: "2", 
    jobName: "backend-api-tests",
    buildNumber: 98,
    status: "FAILURE",
    startTime: "2024-07-03T09:15:00Z",
    duration: 180,
    author: "anna.schmidt@company.com",
    branch: "feature/user-auth",
    url: "http://jenkins.company.com/job/backend-api-tests/98/"
  },
  {
    id: "3",
    jobName: "database-migration",
    buildNumber: 34,
    status: "RUNNING",
    startTime: "2024-07-03T11:00:00Z",
    duration: 120,
    author: "tom.weber@company.com", 
    branch: "release/v2.1",
    url: "http://jenkins.company.com/job/database-migration/34/"
  },
  {
    id: "4",
    jobName: "mobile-app-build",
    buildNumber: 67,
    status: "SUCCESS",
    startTime: "2024-07-03T08:45:00Z",
    duration: 420,
    author: "lisa.hoffmann@company.com",
    branch: "develop",
    url: "http://jenkins.company.com/job/mobile-app-build/67/"
  },
  {
    id: "5",
    jobName: "security-scan",
    buildNumber: 23,
    status: "FAILURE",
    startTime: "2024-07-03T07:30:00Z",
    duration: 95,
    author: "peter.klein@company.com",
    branch: "security/vulnerability-fix",
    url: "http://jenkins.company.com/job/security-scan/23/"
  },
  {
    id: "6",
    jobName: "integration-tests",
    buildNumber: 156,
    status: "ABORTED",
    startTime: "2024-07-03T06:20:00Z",
    duration: 60,
    author: "sarah.lange@company.com",
    branch: "hotfix/critical-bug",
    url: "http://jenkins.company.com/job/integration-tests/156/"
  },
  {
    id: "7",
    jobName: "performance-tests",
    buildNumber: 89,
    status: "SUCCESS",
    startTime: "2024-07-02T22:15:00Z",
    duration: 890,
    author: "michael.gross@company.com",
    branch: "performance/optimization",
    url: "http://jenkins.company.com/job/performance-tests/89/"
  },
  {
    id: "8",
    jobName: "docker-build",
    buildNumber: 201,
    status: "RUNNING",
    startTime: "2024-07-03T11:30:00Z",
    duration: 45,
    author: "julia.fischer@company.com",
    branch: "docker/multi-stage",
    url: "http://jenkins.company.com/job/docker-build/201/"
  }
]

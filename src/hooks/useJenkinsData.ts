
import { useQuery } from '@tanstack/react-query';
import { jenkinsApi } from '@/services/jenkinsApi';
import { Build } from '@/components/BuildCard';

function mapJenkinsBuildToBuild(jenkinsBuild: any, jobName: string): Build {
  const getStatus = (result: string | null, building: boolean) => {
    if (building) return 'RUNNING';
    if (!result) return 'RUNNING';
    
    switch (result) {
      case 'SUCCESS': return 'SUCCESS';
      case 'FAILURE': return 'FAILURE';
      case 'ABORTED': return 'ABORTED';
      default: return 'RUNNING';
    }
  };

  const author = jenkinsBuild.changeSet?.items?.[0]?.author?.fullName || 'Unknown';
  const branch = 'main'; // Jenkins API doesn't always provide branch info easily

  return {
    id: `${jobName}-${jenkinsBuild.number}`,
    jobName,
    buildNumber: jenkinsBuild.number,
    status: getStatus(jenkinsBuild.result, jenkinsBuild.building),
    startTime: new Date(jenkinsBuild.timestamp).toISOString(),
    duration: Math.floor(jenkinsBuild.duration / 1000),
    author,
    branch,
    url: jenkinsBuild.url,
  };
}

export function useJenkinsJobs() {
  return useQuery({
    queryKey: ['jenkins-jobs'],
    queryFn: () => jenkinsApi.getJobs(),
    enabled: !!jenkinsApi.getConfig(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useJenkinsBuilds() {
  const { data: jobs } = useJenkinsJobs();

  return useQuery({
    queryKey: ['jenkins-builds', jobs],
    queryFn: async (): Promise<Build[]> => {
      if (!jobs || jobs.length === 0) return [];

      const allBuilds: Build[] = [];
      
      for (const job of jobs.slice(0, 10)) { // Limit to first 10 jobs to avoid too many requests
        try {
          const recentBuilds = await jenkinsApi.getRecentBuilds(job.name, 5);
          const mappedBuilds = recentBuilds.map(build => 
            mapJenkinsBuildToBuild(build, job.name)
          );
          allBuilds.push(...mappedBuilds);
        } catch (error) {
          console.error(`Failed to fetch builds for job ${job.name}:`, error);
        }
      }

      return allBuilds.sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    },
    enabled: !!jobs && jobs.length > 0,
    refetchInterval: 15000, // Refresh every 15 seconds for builds
  });
}

export function useJenkinsConnection() {
  return useQuery({
    queryKey: ['jenkins-connection'],
    queryFn: () => jenkinsApi.testConnection(),
    enabled: !!jenkinsApi.getConfig(),
    retry: false,
  });
}

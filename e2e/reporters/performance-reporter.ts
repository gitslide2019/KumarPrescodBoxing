import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Custom Performance Reporter for Kumar Prescod Boxing Website
 * Tracks boxing-specific performance metrics and Core Web Vitals
 */
class BoxingPerformanceReporter implements Reporter {
  private testResults: any[] = [];
  private performanceMetrics: any = {
    coreWebVitals: {},
    boxingSpecific: {},
    crossBrowser: {},
    mobilePerformance: {}
  };

  onBegin(config: any, suite: any) {
    console.log('🥊 Starting boxing website performance monitoring...');
    this.performanceMetrics.startTime = new Date().toISOString();
    this.performanceMetrics.projectName = 'Kumar Prescod Boxing';
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Extract performance data from test annotations and attachments
    const performanceData = this.extractPerformanceData(test, result);
    
    this.testResults.push({
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      status: result.status,
      duration: result.duration,
      project: test.parent?.project?.name,
      performance: performanceData,
      timestamp: new Date().toISOString()
    });

    // Log performance issues immediately for boxing-critical metrics
    if (performanceData.boxingCritical) {
      this.logBoxingPerformanceIssues(test.title, performanceData);
    }
  }

  onEnd(result: FullResult) {
    console.log('📊 Generating boxing website performance report...');
    
    this.generatePerformanceReport();
    this.generateBoxingSpecificInsights();
    this.generateMobileOptimizationReport();
    
    console.log('✅ Boxing performance analysis complete!');
  }

  private extractPerformanceData(test: TestCase, result: TestResult) {
    const performanceData: any = {
      boxingCritical: false,
      coreWebVitals: {},
      mediaLoadTimes: {},
      mobileMetrics: {},
      accessibilityScores: {}
    };

    // Check if this is a boxing-critical test
    const boxingCriticalTests = [
      'homepage hero loading',
      'fight record display',
      'training video playback',
      'mobile responsive behavior',
      'fight statistics accuracy'
    ];

    performanceData.boxingCritical = boxingCriticalTests.some(critical => 
      test.title.toLowerCase().includes(critical.toLowerCase())
    );

    // Extract performance metrics from test attachments
    result.attachments.forEach(attachment => {
      if (attachment.name === 'performance-metrics') {
        try {
          const metrics = JSON.parse(attachment.body?.toString() || '{}');
          performanceData.coreWebVitals = metrics.coreWebVitals || {};
          performanceData.mediaLoadTimes = metrics.mediaLoadTimes || {};
          performanceData.mobileMetrics = metrics.mobileMetrics || {};
        } catch (error) {
          console.warn('Failed to parse performance metrics:', error);
        }
      }
    });

    return performanceData;
  }

  private logBoxingPerformanceIssues(testTitle: string, performanceData: any) {
    const issues = [];

    // Check Core Web Vitals against boxing website thresholds
    const { coreWebVitals } = performanceData;
    
    if (coreWebVitals.LCP > 2500) {
      issues.push(`🐌 Slow LCP (${coreWebVitals.LCP}ms) - Boxing media needs faster loading`);
    }
    
    if (coreWebVitals.FID > 100) {
      issues.push(`⚡ Poor FID (${coreWebVitals.FID}ms) - Fight stats interaction delayed`);
    }
    
    if (coreWebVitals.CLS > 0.1) {
      issues.push(`📱 Layout shift (${coreWebVitals.CLS}) - Boxing content jumping`);
    }

    // Check boxing-specific performance issues
    if (performanceData.mediaLoadTimes.fightVideos > 5000) {
      issues.push(`🎬 Slow fight video loading (${performanceData.mediaLoadTimes.fightVideos}ms)`);
    }

    if (performanceData.mobileMetrics.responsiveBreakTime > 1000) {
      issues.push(`📱 Slow mobile responsive transition (${performanceData.mobileMetrics.responsiveBreakTime}ms)`);
    }

    if (issues.length > 0) {
      console.warn(`⚠️ BOXING PERFORMANCE ISSUES in "${testTitle}":`);
      issues.forEach(issue => console.warn(`   ${issue}`));
    }
  }

  private generatePerformanceReport() {
    const reportPath = path.join(__dirname, '..', 'performance-report.json');
    
    const summary = {
      testRun: {
        timestamp: this.performanceMetrics.startTime,
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => r.status === 'passed').length,
        failedTests: this.testResults.filter(r => r.status === 'failed').length
      },
      
      boxingCriticalMetrics: {
        fightRecordPerformance: this.analyzeBoxingFeature('fight record'),
        trainingMediaPerformance: this.analyzeBoxingFeature('training'),
        mobileBoxingExperience: this.analyzeBoxingFeature('mobile'),
        ticketPurchaseFlow: this.analyzeBoxingFeature('ticket')
      },
      
      coreWebVitals: this.aggregateCoreWebVitals(),
      crossBrowserConsistency: this.analyzeCrossBrowserConsistency(),
      accessibilityScores: this.aggregateAccessibilityScores(),
      
      recommendations: this.generateBoxingRecommendations()
    };

    fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    console.log(`📊 Detailed performance report saved: ${reportPath}`);
  }

  private analyzeBoxingFeature(feature: string) {
    const relevantTests = this.testResults.filter(test => 
      test.fullTitle.toLowerCase().includes(feature.toLowerCase())
    );

    if (relevantTests.length === 0) return null;

    const avgDuration = relevantTests.reduce((sum, test) => sum + test.duration, 0) / relevantTests.length;
    const successRate = relevantTests.filter(test => test.status === 'passed').length / relevantTests.length;

    return {
      testCount: relevantTests.length,
      averageDuration: Math.round(avgDuration),
      successRate: Math.round(successRate * 100),
      status: successRate >= 0.95 ? 'excellent' : successRate >= 0.8 ? 'good' : 'needs_improvement'
    };
  }

  private aggregateCoreWebVitals() {
    const allVitals = this.testResults
      .map(test => test.performance?.coreWebVitals)
      .filter(vitals => vitals && Object.keys(vitals).length > 0);

    if (allVitals.length === 0) return null;

    return {
      LCP: {
        average: this.calculateAverage(allVitals.map(v => v.LCP).filter(Boolean)),
        threshold: 2500,
        status: 'needs_analysis'
      },
      FID: {
        average: this.calculateAverage(allVitals.map(v => v.FID).filter(Boolean)),
        threshold: 100,
        status: 'needs_analysis'
      },
      CLS: {
        average: this.calculateAverage(allVitals.map(v => v.CLS).filter(Boolean)),
        threshold: 0.1,
        status: 'needs_analysis'
      }
    };
  }

  private analyzeCrossBrowserConsistency() {
    const browserProjects = ['chromium-desktop', 'firefox-desktop', 'webkit-desktop', 'mobile-chrome', 'mobile-safari'];
    const consistency: any = {};

    browserProjects.forEach(project => {
      const projectResults = this.testResults.filter(test => test.project === project);
      consistency[project] = {
        totalTests: projectResults.length,
        passRate: projectResults.length > 0 ? 
          projectResults.filter(test => test.status === 'passed').length / projectResults.length : 0,
        avgDuration: projectResults.length > 0 ?
          projectResults.reduce((sum, test) => sum + test.duration, 0) / projectResults.length : 0
      };
    });

    return consistency;
  }

  private aggregateAccessibilityScores() {
    const accessibilityTests = this.testResults.filter(test => 
      test.fullTitle.toLowerCase().includes('accessibility') ||
      test.fullTitle.toLowerCase().includes('a11y')
    );

    return {
      totalAccessibilityTests: accessibilityTests.length,
      passRate: accessibilityTests.length > 0 ?
        accessibilityTests.filter(test => test.status === 'passed').length / accessibilityTests.length : 0,
      boxingStatsAccessibility: accessibilityTests.filter(test => 
        test.fullTitle.toLowerCase().includes('stats')
      ).length
    };
  }

  private generateBoxingRecommendations() {
    const recommendations = [];

    // Analyze performance patterns and generate boxing-specific recommendations
    const avgLoadTime = this.calculateAverage(this.testResults.map(test => test.duration));
    
    if (avgLoadTime > 5000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        issue: 'Slow page load times affecting boxing fan experience',
        solution: 'Optimize boxing media assets, implement lazy loading for fight videos and training images'
      });
    }

    const mobileTests = this.testResults.filter(test => test.project?.includes('mobile'));
    const mobilePassRate = mobileTests.length > 0 ? 
      mobileTests.filter(test => test.status === 'passed').length / mobileTests.length : 0;

    if (mobilePassRate < 0.9) {
      recommendations.push({
        type: 'mobile',
        priority: 'critical',
        issue: 'Mobile experience issues - critical for boxing fans watching fights on mobile',
        solution: 'Improve mobile responsive design, optimize touch interactions for fight statistics'
      });
    }

    return recommendations;
  }

  private generateBoxingSpecificInsights() {
    const insights = {
      fightNightReadiness: this.assessFightNightReadiness(),
      fanEngagementMetrics: this.analyzeFanEngagementPerformance(),
      mediaOptimization: this.analyzeMediaPerformance()
    };

    const insightsPath = path.join(__dirname, '..', 'boxing-insights.json');
    fs.writeFileSync(insightsPath, JSON.stringify(insights, null, 2));
    console.log(`🥊 Boxing-specific insights saved: ${insightsPath}`);
  }

  private assessFightNightReadiness() {
    // Assess if the website can handle fight night traffic spikes
    const criticalFeatures = ['ticket purchase', 'fight streaming', 'live updates'];
    return {
      trafficSpike: 'high_capacity_needed',
      criticalFeatures: criticalFeatures.map(feature => ({
        feature,
        readiness: 'needs_load_testing'
      }))
    };
  }

  private analyzeFanEngagementPerformance() {
    return {
      socialMediaIntegration: 'needs_performance_analysis',
      fightStatistics: 'fast_loading_required',
      trainingVideos: 'optimization_needed'
    };
  }

  private analyzeMediaPerformance() {
    return {
      fightVideos: 'compression_optimization_needed',
      trainingPhotos: 'lazy_loading_implemented',
      heroVideos: 'preload_optimization_required'
    };
  }

  private generateMobileOptimizationReport() {
    const mobileTests = this.testResults.filter(test => 
      test.project?.includes('mobile') || test.project?.includes('tablet')
    );

    const mobileReport = {
      deviceCoverage: {
        iPhone: mobileTests.filter(test => test.project?.includes('mobile-safari')).length,
        Android: mobileTests.filter(test => test.project?.includes('mobile-chrome')).length,
        tablet: mobileTests.filter(test => test.project?.includes('tablet')).length
      },
      boxingFanPriorities: {
        fightScheduleVisibility: 'mobile_first_design',
        ticketPurchaseFlow: 'touch_optimized',
        videoPlayback: 'mobile_bandwidth_optimized'
      }
    };

    const mobilePath = path.join(__dirname, '..', 'mobile-optimization.json');
    fs.writeFileSync(mobilePath, JSON.stringify(mobileReport, null, 2));
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
  }
}

export default BoxingPerformanceReporter;
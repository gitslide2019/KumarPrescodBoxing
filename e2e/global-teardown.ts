import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown for Kumar Prescod Boxing E2E tests
 * Cleans up test environment and generates performance reports
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up Kumar Prescod Boxing E2E Tests...');
  
  try {
    // Generate performance summary report
    console.log('📊 Generating boxing website performance report...');
    await generatePerformanceReport();
    
    // Clean up temporary files
    console.log('🗑️ Cleaning up temporary test files...');
    const tempDirs = [
      path.join(__dirname, 'temp'),
      path.join(__dirname, 'cache')
    ];
    
    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
    
    // Archive test results for boxing performance analysis
    console.log('📦 Archiving test results...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsDir = path.join(__dirname, 'test-results');
    const archiveDir = path.join(__dirname, 'archives', `test-run-${timestamp}`);
    
    if (fs.existsSync(resultsDir)) {
      fs.mkdirSync(path.dirname(archiveDir), { recursive: true });
      fs.renameSync(resultsDir, archiveDir);
      console.log(`📁 Results archived to: ${archiveDir}`);
    }
    
    console.log('✅ Boxing website E2E teardown complete!');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

async function generatePerformanceReport() {
  const reportPath = path.join(__dirname, 'performance-summary.json');
  const baselinePath = path.join(__dirname, 'fixtures', 'baseline-metrics.json');
  
  try {
    let baseline = {};
    if (fs.existsSync(baselinePath)) {
      baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Kumar Prescod Boxing E2E',
      baseline: baseline,
      summary: {
        totalTests: 0, // Will be populated by test results
        passed: 0,
        failed: 0,
        performance: {
          coreWebVitals: {},
          loadTimes: {},
          boxingSpecific: {
            fightRecordLoadTime: null,
            videoStreamingPerformance: null,
            mobileResponsiveness: null
          }
        }
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Performance report generated: ${reportPath}`);
    
  } catch (error) {
    console.error('Failed to generate performance report:', error);
  }
}

export default globalTeardown;
import { test, expect, Page } from '@playwright/test';
import { performanceUtils } from '../utils/performance';

/**
 * Ticket Purchasing Tests - Kumar Prescod Boxing
 * Tests ticket purchasing flow, payment integration, and fight event booking
 */
test.describe('Ticket Purchasing Flow - Boxing Event Sales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display ticket purchase options prominently', async ({ page }) => {
    // Look for ticket purchase buttons/links
    const ticketElements = page.locator(
      'a[href*="ticket"], ' +
      'button:has-text("ticket"), ' +
      'a:has-text("buy"), ' +
      'a:has-text("get tickets"), ' +
      '.ticket-button, ' +
      '[data-testid*="ticket"]'
    );
    
    await expect(ticketElements.first()).toBeVisible();
    
    // Ticket buttons should be prominent and accessible
    const firstTicketButton = ticketElements.first();
    const buttonBox = await firstTicketButton.boundingBox();
    
    // Should be large enough for easy clicking
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
    expect(buttonBox?.width).toBeGreaterThanOrEqual(100);
  });

  test('should show homecoming fight ticket information', async ({ page }) => {
    // Look for homecoming fight ticket details
    const homecomingTickets = page.locator('text=/homecoming|august.*16|oakland.*arena/i');
    await expect(homecomingTickets.first()).toBeVisible();
    
    // Check for fight date and venue
    const fightDate = page.locator('text=/aug.*16|august.*16|8.*16.*2025/i');
    await expect(fightDate.first()).toBeVisible();
    
    const venue = page.locator('text=/oakland.*arena|marriott.*city.*center/i');
    await expect(venue.first()).toBeVisible();
    
    // Look for ticket pricing information
    const pricing = page.locator('text=/\\$\\d+|price|from.*\\$/i');
    if (await pricing.count() > 0) {
      await expect(pricing.first()).toBeVisible();
      
      // Verify pricing format
      const priceText = await pricing.first().textContent();
      expect(priceText).toMatch(/\$\d+/);
    }
  });

  test('should navigate to ticket purchasing page', async ({ page }) => {
    // Find and click ticket purchase link
    const ticketLink = page.locator('a[href*="ticket"], a:has-text("get tickets")').first();
    await expect(ticketLink).toBeVisible();
    
    const href = await ticketLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // Test ticket link functionality
    if (href?.includes('http')) {
      // External ticket link - verify it opens correctly
      const target = await ticketLink.getAttribute('target');
      expect(target).toBe('_blank');
      
      const rel = await ticketLink.getAttribute('rel');
      expect(rel).toMatch(/noopener|noreferrer/);
    } else if (href?.startsWith('/')) {
      // Internal link - test navigation
      await ticketLink.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on ticket purchasing page
      const currentUrl = page.url();
      expect(currentUrl).toContain('ticket');
    }
  });

  test('should display multiple ticket tiers and pricing', async ({ page }) => {
    // Navigate to ticket page if not already there
    const ticketLink = page.locator('a[href*="ticket"]').first();
    if (await ticketLink.count() > 0) {
      const href = await ticketLink.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await ticketLink.click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Look for different ticket categories
    const ticketTiers = page.locator(
      'text=/general.*admission|vip|ringside|premium|floor.*seats/i, ' +
      '.ticket-tier, ' +
      '[data-tier], ' +
      '.price-option'
    );
    
    if (await ticketTiers.count() > 0) {
      // Should have multiple pricing options
      expect(await ticketTiers.count()).toBeGreaterThanOrEqual(1);
      
      // Each tier should show pricing
      for (let i = 0; i < Math.min(3, await ticketTiers.count()); i++) {
        const tier = ticketTiers.nth(i);
        const tierText = await tier.textContent();
        
        // Should contain pricing information
        if (tierText?.includes('$')) {
          console.log(`✅ Ticket tier ${i + 1} has pricing: ${tierText}`);
        }
      }
    }
    
    // Check for ticket descriptions and benefits
    const descriptions = page.locator('text=/includes|benefits|perks|access/i');
    if (await descriptions.count() > 0) {
      await expect(descriptions.first()).toBeVisible();
    }
  });

  test('should handle ticket quantity selection', async ({ page }) => {
    // Look for quantity selectors
    const quantitySelectors = page.locator(
      'input[type="number"], ' +
      'select[name*="quantity"], ' +
      '.quantity-selector, ' +
      'button:has-text("+"), ' +
      'button:has-text("-")'
    );
    
    if (await quantitySelectors.count() > 0) {
      const quantityInput = quantitySelectors.first();
      
      if (await quantityInput.evaluate(el => el.tagName.toLowerCase() === 'input')) {
        // Test numeric input
        await quantityInput.fill('2');
        const value = await quantityInput.inputValue();
        expect(value).toBe('2');
        
        // Should have reasonable limits
        const max = await quantityInput.getAttribute('max');
        if (max) {
          expect(parseInt(max)).toBeGreaterThanOrEqual(8); // Group bookings
        }
      }
      
      // Test increment/decrement buttons
      const incrementButton = page.locator('button:has-text("+")');
      if (await incrementButton.count() > 0) {
        await incrementButton.first().click();
        await page.waitForTimeout(500);
        console.log('✅ Ticket quantity increment functionality detected');
      }
    }
  });

  test('should display boxing event details and seating information', async ({ page }) => {
    // Look for seating chart or venue information
    const seatingInfo = page.locator(
      'text=/seating.*chart|venue.*map|seat.*selection/i, ' +
      '.seating-chart, ' +
      'img[src*="seating"], ' +
      'svg[class*="seat"]'
    );
    
    if (await seatingInfo.count() > 0) {
      await expect(seatingInfo.first()).toBeVisible();
      console.log('✅ Seating information available for boxing venue');
    }
    
    // Check for event details
    const eventDetails = page.locator('text=/doors.*open|start.*time|main.*event|undercard/i');
    
    if (await eventDetails.count() > 0) {
      await expect(eventDetails.first()).toBeVisible();
    }
    
    // Look for boxing-specific amenities
    const amenities = page.locator('text=/parking|concessions|merchandise|vip.*lounge/i');
    
    if (await amenities.count() > 0) {
      await expect(amenities.first()).toBeVisible();
    }
  });

  test('should handle payment processing integration', async ({ page }) => {
    // Look for payment method options
    const paymentMethods = page.locator(
      'text=/credit.*card|paypal|apple.*pay|google.*pay/i, ' +
      'img[src*="visa"], ' +
      'img[src*="mastercard"], ' +
      'img[src*="paypal"], ' +
      '.payment-method'
    );
    
    if (await paymentMethods.count() > 0) {
      await expect(paymentMethods.first()).toBeVisible();
      console.log('✅ Payment method options available');
    }
    
    // Check for secure payment indicators
    const securityIndicators = page.locator(
      'text=/secure|ssl|encrypted|protected/i, ' +
      'img[src*="ssl"], ' +
      '.security-badge, ' +
      '[data-secure]'
    );
    
    if (await securityIndicators.count() > 0) {
      await expect(securityIndicators.first()).toBeVisible();
    }
    
    // Look for payment form fields (without filling them)
    const paymentFields = page.locator(
      'input[type="email"], ' +
      'input[placeholder*="email"], ' +
      'input[placeholder*="name"], ' +
      'input[placeholder*="card"]'
    );
    
    if (await paymentFields.count() > 0) {
      // Fields should be properly labeled
      const firstField = paymentFields.first();
      const hasLabel = await firstField.evaluate((input) => {
        const id = input.getAttribute('id');
        const name = input.getAttribute('name');
        const placeholder = input.getAttribute('placeholder');
        const ariaLabel = input.getAttribute('aria-label');
        
        return !!(
          (id && document.querySelector(`label[for="${id}"]`)) ||
          ariaLabel ||
          placeholder
        );
      });
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should provide ticket purchase confirmation flow', async ({ page }) => {
    // Look for order summary or confirmation elements
    const orderSummary = page.locator(
      'text=/order.*summary|total.*amount|subtotal/i, ' +
      '.order-summary, ' +
      '.checkout-summary, ' +
      '[data-testid*="summary"]'
    );
    
    if (await orderSummary.count() > 0) {
      await expect(orderSummary.first()).toBeVisible();
    }
    
    // Check for confirmation messaging
    const confirmationText = page.locator(
      'text=/complete.*purchase|confirm.*order|place.*order/i, ' +
      'button:has-text("buy"), ' +
      'button:has-text("purchase"), ' +
      'button:has-text("confirm")'
    );
    
    if (await confirmationText.count() > 0) {
      await expect(confirmationText.first()).toBeVisible();
    }
    
    // Look for terms and conditions
    const termsAndConditions = page.locator(
      'text=/terms.*conditions|privacy.*policy|refund.*policy/i, ' +
      'input[type="checkbox"]'
    );
    
    if (await termsAndConditions.count() > 0) {
      await expect(termsAndConditions.first()).toBeVisible();
    }
  });

  test('should be mobile-optimized for boxing fans', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    }
    
    // Ticket purchasing should work well on mobile
    const ticketButton = page.locator('a[href*="ticket"], button:has-text("ticket")').first();
    
    if (await ticketButton.count() > 0) {
      await expect(ticketButton).toBeVisible();
      
      // Button should be touch-friendly
      const buttonBox = await ticketButton.boundingBox();
      expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
      
      // Test touch interaction
      await ticketButton.tap();
      await page.waitForTimeout(1000);
    }
    
    // Check mobile-specific payment options
    const mobilePay = page.locator('text=/apple.*pay|google.*pay|samsung.*pay/i');
    
    if (await mobilePay.count() > 0) {
      await expect(mobilePay.first()).toBeVisible();
      console.log('📱 Mobile payment options available for boxing tickets');
    }
    
    // Form fields should be mobile-optimized
    const formFields = page.locator('input[type="email"], input[type="tel"], input[type="text"]');
    
    if (await formFields.count() > 0) {
      const firstField = formFields.first();
      
      // Should have appropriate input types for mobile keyboards
      const inputType = await firstField.getAttribute('type');
      const inputMode = await firstField.getAttribute('inputmode');
      const autocomplete = await firstField.getAttribute('autocomplete');
      
      console.log(`📱 Mobile input optimization: type=${inputType}, inputmode=${inputMode}, autocomplete=${autocomplete}`);
    }
  });

  test('should handle ticket availability and sold out scenarios', async ({ page }) => {
    // Look for availability indicators
    const availability = page.locator(
      'text=/available|sold.*out|limited.*tickets|few.*left/i, ' +
      '.availability, ' +
      '.stock-status, ' +
      '[data-availability]'
    );
    
    if (await availability.count() > 0) {
      await expect(availability.first()).toBeVisible();
      
      const availabilityText = await availability.first().textContent();
      console.log(`🎫 Ticket availability status: ${availabilityText}`);
    }
    
    // Check for waitlist functionality if sold out
    const waitlist = page.locator(
      'text=/waitlist|notify.*me|join.*list/i, ' +
      'button:has-text("waitlist"), ' +
      '.waitlist-button'
    );
    
    if (await waitlist.count() > 0) {
      await expect(waitlist.first()).toBeVisible();
      console.log('📝 Ticket waitlist functionality available');
    }
    
    // Look for early bird or special pricing
    const specialPricing = page.locator(
      'text=/early.*bird|special.*price|discount|promo/i, ' +
      '.special-offer, ' +
      '.discount-badge'
    );
    
    if (await specialPricing.count() > 0) {
      await expect(specialPricing.first()).toBeVisible();
    }
  });

  test('should provide accessibility for ticket purchasing', async ({ page }) => {
    // Check for accessibility accommodations
    const accessibility = page.locator(
      'text=/wheelchair.*accessible|ada.*compliant|special.*needs/i, ' +
      'input[type="checkbox"][name*="accessibility"], ' +
      '.accessibility-options'
    );
    
    if (await accessibility.count() > 0) {
      await expect(accessibility.first()).toBeVisible();
      console.log('♿ Accessibility accommodations available for boxing venue');
    }
    
    // Check form accessibility
    const formElements = page.locator('input, select, button');
    
    if (await formElements.count() > 0) {
      // First few form elements should have proper labels
      for (let i = 0; i < Math.min(3, await formElements.count()); i++) {
        const element = formElements.nth(i);
        const hasAccessibleName = await element.evaluate((el) => {
          const id = el.getAttribute('id');
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledby = el.getAttribute('aria-labelledby');
          const placeholder = el.getAttribute('placeholder');
          
          return !!(
            (id && document.querySelector(`label[for="${id}"]`)) ||
            ariaLabel ||
            ariaLabelledby ||
            (el.tagName === 'BUTTON' && el.textContent?.trim()) ||
            placeholder
          );
        });
        
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });

  test('should load ticket purchasing page efficiently', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to ticket page
    const ticketLink = page.locator('a[href*="ticket"]').first();
    if (await ticketLink.count() > 0) {
      const href = await ticketLink.getAttribute('href');
      if (href && !href.startsWith('http')) {
        await ticketLink.click();
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(10000); // 10 seconds max
        
        // Page should have essential ticket content
        const ticketContent = page.locator(
          'text=/ticket|price|purchase|buy/i, ' +
          'form, ' +
          'button, ' +
          'input'
        );
        
        expect(await ticketContent.count()).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('should integrate with boxing event marketing', async ({ page }) => {
    // Look for fight promotion integration
    const fightPromo = page.locator(
      'text=/main.*event|undercard|fight.*card/i, ' +
      'img[src*="poster"], ' +
      'img[src*="fight"], ' +
      '.fight-poster'
    );
    
    if (await fightPromo.count() > 0) {
      await expect(fightPromo.first()).toBeVisible();
    }
    
    // Check for boxer information on ticket page
    const boxerInfo = page.locator('text=/kumar.*prescod|the.*raw.*one|professional.*boxer/i');
    
    if (await boxerInfo.count() > 0) {
      await expect(boxerInfo.first()).toBeVisible();
    }
    
    // Look for social sharing of ticket purchases
    const socialShare = page.locator(
      'text=/share|tell.*friends|spread.*word/i, ' +
      'button:has-text("share"), ' +
      'a[href*="facebook"], ' +
      'a[href*="twitter"]'
    );
    
    if (await socialShare.count() > 0) {
      await expect(socialShare.first()).toBeVisible();
    }
  });
});
// Email Service for Salem University Quiz Integration
class EmailService {
  constructor(config = {}) {
    this.apiEndpoint = config.apiEndpoint || '/api/email';
    this.templateIds = {
      quizConfirmation: 'quiz_confirmation',
      careerBlueprint: 'career_blueprint',
      followUp24Hour: 'follow_up_24',
      followUp48Hour: 'follow_up_48',
      applicationReminder: 'app_reminder'
    };
  }

  // Send immediate quiz confirmation email
  async sendQuizConfirmation({ email, name, responses }) {
    const emailData = {
      to: email,
      templateId: this.templateIds.quizConfirmation,
      templateData: {
        firstName: name.split(' ')[0],
        quizStartTime: new Date().toISOString(),
        estimatedCompletionTime: '2-3 minutes',
        supportEmail: 'support@salem.edu',
        unsubscribeToken: this.generateToken(email)
      }
    };

    try {
      const response = await fetch(`${this.apiEndpoint}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) throw new Error('Failed to send confirmation email');
      
      // Log engagement
      await this.logEmailEvent('quiz_confirmation_sent', email);
      
      return { success: true, messageId: await response.json() };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send career blueprint results email
  async sendCareerBlueprint({ email, name, blueprint, programs }) {
    const emailData = {
      to: email,
      templateId: this.templateIds.careerBlueprint,
      templateData: {
        firstName: name.split(' ')[0],
        fullName: name,
        blueprintUrl: blueprint.url,
        expiresIn: '48 hours',
        programs: programs.map(p => ({
          name: p.name,
          duration: p.duration,
          nextStartDate: p.nextStartDate,
          highlights: p.highlights
        })),
        year3Career: blueprint.year3,
        year5Career: blueprint.year5,
        year10Career: blueprint.year10,
        ctaUrl: `${blueprint.applicationUrl}?source=email&utm_campaign=quiz_blueprint`,
        salemFeatures: {
          heritage: '130 years of excellence',
          graduates: '20,000+ successful alumni',
          tutoring: 'Free weekly tutoring included',
          support: '24/7 online resources'
        },
        urgency: {
          deadline: this.getDeadline(48),
          savings: '$75 application fee waived',
          bonus: 'Priority admission review'
        }
      }
    };

    try {
      const response = await fetch(`${this.apiEndpoint}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) throw new Error('Failed to send blueprint email');
      
      // Schedule follow-up emails
      await this.scheduleFollowUps(email, name, blueprint);
      
      // Log engagement
      await this.logEmailEvent('blueprint_sent', email);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending blueprint email:', error);
      return { success: false, error: error.message };
    }
  }

  // Schedule automated follow-up emails
  async scheduleFollowUps(email, name, blueprint) {
    // 24-hour follow-up
    await this.scheduleEmail({
      to: email,
      templateId: this.templateIds.followUp24Hour,
      sendAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      templateData: {
        firstName: name.split(' ')[0],
        blueprintUrl: blueprint.url,
        testimonial: this.getRandomTestimonial(),
        urgencyHours: 24,
        ctaUrl: blueprint.applicationUrl
      }
    });

    // 48-hour follow-up (if not applied)
    await this.scheduleEmail({
      to: email,
      templateId: this.templateIds.followUp48Hour,
      sendAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      condition: 'not_applied',
      templateData: {
        firstName: name.split(' ')[0],
        blueprintExpiring: true,
        lastChance: true,
        additionalIncentive: 'First semester textbooks included (Save $500)',
        ctaUrl: blueprint.applicationUrl
      }
    });
  }

  // Schedule a future email
  async scheduleEmail(emailData) {
    try {
      const response = await fetch(`${this.apiEndpoint}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error scheduling email:', error);
      return false;
    }
  }

  // Track email engagement
  async logEmailEvent(eventType, email, metadata = {}) {
    try {
      await fetch(`${this.apiEndpoint}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          email,
          timestamp: new Date().toISOString(),
          metadata
        })
      });
    } catch (error) {
      console.error('Error logging email event:', error);
    }
  }

  // Generate unsubscribe token
  generateToken(email) {
    return btoa(email + Date.now()).replace(/=/g, '');
  }

  // Get deadline with hours
  getDeadline(hours) {
    const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
    return deadline.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  // Get random success testimonial
  getRandomTestimonial() {
    const testimonials = [
      {
        quote: "Salem's program changed my life. I went from retail to IT management in just 2 years!",
        author: "Sarah M., Class of 2023",
        program: "B.S. Information Technology"
      },
      {
        quote: "The free tutoring made all the difference. I never felt alone in my journey.",
        author: "James T., Class of 2022",
        program: "MBA in Business Administration"
      },
      {
        quote: "I doubled my income within 18 months of graduating. Best decision ever!",
        author: "Maria L., Class of 2023",
        program: "B.S. in Nursing"
      }
    ];
    
    return testimonials[Math.floor(Math.random() * testimonials.length)];
  }

  // Email template preview (for testing)
  previewTemplate(templateId, sampleData) {
    const templates = {
      quiz_confirmation: `
        Subject: ${sampleData.firstName}, Your Career Blueprint is Being Created! 🚀
        
        Hi ${sampleData.firstName}!
        
        Thanks for starting your career journey with Salem University! 
        
        Your personalized career blueprint is being crafted and will be ready in just 2-3 minutes.
        
        While you wait, did you know:
        ✓ 94% of our graduates find employment within 6 months
        ✓ Our programs include FREE weekly tutoring
        ✓ You're joining 20,000+ successful alumni
        
        Complete your quiz to unlock:
        • Your 3, 5, and 10-year career projections
        • Personalized program recommendations
        • $75 application fee waiver (limited time!)
        
        Questions? Reply to this email or call 1-800-SALEM-EDU
        
        Excited for your future,
        The Salem University Team
      `,
      career_blueprint: `
        Subject: 🎉 ${sampleData.firstName}, Your Career Blueprint is Ready!
        
        Hi ${sampleData.firstName}!
        
        Your personalized career blueprint is here! Based on your responses, we've mapped out an exciting path for your future.
        
        🎯 YOUR CAREER TRAJECTORY:
        • 3 Years: ${sampleData.year3Career.role}
        • 5 Years: ${sampleData.year5Career.role}  
        • 10 Years: ${sampleData.year10Career.role}
        
        📚 RECOMMENDED PROGRAMS:
        ${sampleData.programs.map(p => `• ${p.name} - Starts ${p.nextStartDate}`).join('\n')}
        
        ⚡ EXCLUSIVE OFFER (Expires in 48 hours):
        ✓ Application fee WAIVED (Save $75)
        ✓ Priority admission review
        ✓ First semester textbooks included (Save $500)
        
        [VIEW MY FULL BLUEPRINT] → ${sampleData.blueprintUrl}
        
        [START MY APPLICATION NOW] → ${sampleData.ctaUrl}
        
        Don't let this opportunity pass by! Your future is waiting.
        
        Cheering you on,
        The Salem University Team
        
        P.S. Have questions? Schedule a call with an advisor: [BOOK TIME]
      `
    };
    
    return templates[templateId] || 'Template not found';
  }
}

// Export for use in the application
module.exports = EmailService;

// Example usage:
/*
const emailService = new EmailService({
  apiEndpoint: 'https://api.salem.edu/email'
});

// Send confirmation when quiz starts
await emailService.sendQuizConfirmation({
  email: 'student@email.com',
  name: 'John Smith',
  responses: { started: true }
});

// Send blueprint when quiz completes
await emailService.sendCareerBlueprint({
  email: 'student@email.com',
  name: 'John Smith',
  blueprint: {
    url: 'https://salem.edu/blueprint/abc123',
    applicationUrl: 'https://apply.salem.edu',
    year3: { role: 'Marketing Coordinator' },
    year5: { role: 'Marketing Manager' },
    year10: { role: 'Director of Marketing' }
  },
  programs: [
    {
      name: 'B.S. in Business Administration',
      duration: '4 years',
      nextStartDate: 'January 15, 2024',
      highlights: ['100% online', 'ACBSP accredited']
    }
  ]
});
*/
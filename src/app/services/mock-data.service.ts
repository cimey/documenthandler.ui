import { Injectable } from '@angular/core';
import { AppEvent, ChatMessage, DocFile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private events: AppEvent[] = [
    {
      id: 'evt-001',
      title: 'Buy KIA EV6',
      type: 'Vehicle Purchase',
      status: 'Active',
      eventDate: '2026-03-15',
      description: 'Purchase of KIA EV6 GT-Line from AutoDeal Amsterdam',
      emoji: '🚗',
      colorClass: 'blue',
      tags: ['kia', 'ev6', 'electric', 'rdw'],
      subSections: [
        {
          id: 'ss-001-1',
          title: 'Dealer & Contract',
          icon: '📝',
          description: 'Signed agreements and dealer documentation',
          isRequired: true,
          documents: [
            { id: 'doc-001', name: 'Signed Dealer Contract', category: 'Contract', fileType: 'pdf', uploadDate: '2026-03-15', size: '2.4 MB', tags: ['contract', 'dealer'], referenceNumber: 'DC-2026-4521' },
            { id: 'doc-002', name: 'Dealer Invoice', category: 'Finance', fileType: 'pdf', uploadDate: '2026-03-15', size: '0.8 MB', tags: ['invoice'] },
            { id: 'doc-003', name: 'Vehicle Handover Checklist', category: 'Other', fileType: 'pdf', uploadDate: '2026-03-20', size: '0.3 MB', tags: ['handover', 'checklist'] }
          ]
        },
        {
          id: 'ss-001-2',
          title: 'Government & Registration',
          icon: '🏛️',
          description: 'RDW, meld code and registration documents',
          isRequired: true,
          documents: [
            { id: 'doc-004', name: 'RDW Registration Document', category: 'Government', fileType: 'pdf', uploadDate: '2026-03-20', size: '1.1 MB', tags: ['rdw', 'registration'], referenceNumber: 'RDW-EV6-2026-88123' },
            { id: 'doc-005', name: 'Meld Code Certificate', category: 'Government', fileType: 'jpg', uploadDate: '2026-03-20', size: '0.5 MB', tags: ['meld', 'code'] }
          ]
        },
        {
          id: 'ss-001-3',
          title: 'Insurance',
          icon: '🛡️',
          description: 'Vehicle insurance policy and green card',
          isRequired: true,
          documents: [
            { id: 'doc-006', name: 'Insurance Policy AllRisk', category: 'Insurance', fileType: 'pdf', uploadDate: '2026-03-18', expiryDate: '2027-03-17', size: '3.2 MB', tags: ['insurance', 'allrisk'], referenceNumber: 'INS-2026-78432' },
            { id: 'doc-007', name: 'Green Card', category: 'Insurance', fileType: 'pdf', uploadDate: '2026-03-18', expiryDate: '2027-03-17', size: '0.3 MB', tags: ['greencard'] }
          ]
        },
        {
          id: 'ss-001-4',
          title: 'Finance & Payment',
          icon: '💳',
          description: 'Payment receipts and financing documents',
          isRequired: true,
          documents: [
            { id: 'doc-008', name: 'Payment Confirmation', category: 'Finance', fileType: 'pdf', uploadDate: '2026-03-15', size: '0.4 MB', tags: ['payment'] },
            { id: 'doc-009', name: 'Trade-in Agreement', category: 'Contract', fileType: 'pdf', uploadDate: '2026-03-15', size: '1.2 MB', tags: ['trade-in'] }
          ]
        },
        {
          id: 'ss-001-5',
          title: 'Warranty & Service',
          icon: '🔧',
          description: 'Warranty terms and service plan',
          isRequired: false,
          documents: [
            { id: 'doc-010', name: 'KIA Warranty Certificate', category: 'Warranty', fileType: 'pdf', uploadDate: '2026-03-15', expiryDate: '2032-03-15', size: '1.8 MB', tags: ['warranty', 'kia'] },
            { id: 'doc-011', name: 'Service Plan Agreement', category: 'Service', fileType: 'pdf', uploadDate: '2026-03-15', expiryDate: '2029-03-15', size: '0.9 MB', tags: ['service'] }
          ]
        }
      ]
    },
    {
      id: 'evt-002',
      title: 'House Purchase Amsterdam',
      type: 'Real Estate',
      status: 'Completed',
      eventDate: '2025-11-10',
      description: 'Purchase of apartment at Keizersgracht 312, Amsterdam',
      emoji: '🏠',
      colorClass: 'green',
      tags: ['house', 'amsterdam', 'mortgage', 'notaris'],
      subSections: [
        {
          id: 'ss-002-1',
          title: 'Purchase Agreement',
          icon: '📜',
          description: 'Preliminary and final purchase agreements',
          isRequired: true,
          documents: [
            { id: 'doc-012', name: 'Preliminary Purchase Agreement', category: 'Contract', fileType: 'pdf', uploadDate: '2025-10-05', size: '4.1 MB', tags: ['koopcontract'], referenceNumber: 'KK-2025-9921' },
            { id: 'doc-013', name: 'Notarial Deed of Transfer', category: 'Government', fileType: 'pdf', uploadDate: '2025-11-10', size: '2.8 MB', tags: ['notaris', 'deed'] },
            { id: 'doc-014', name: 'Land Registry Extract', category: 'Government', fileType: 'pdf', uploadDate: '2025-11-10', size: '0.6 MB', tags: ['kadaster'] }
          ]
        },
        {
          id: 'ss-002-2',
          title: 'Mortgage',
          icon: '🏦',
          description: 'Mortgage offer, agreement and conditions',
          isRequired: true,
          documents: [
            { id: 'doc-015', name: 'Mortgage Offer Letter', category: 'Finance', fileType: 'pdf', uploadDate: '2025-10-20', size: '1.5 MB', tags: ['mortgage', 'offer'] },
            { id: 'doc-016', name: 'Mortgage Agreement', category: 'Contract', fileType: 'pdf', uploadDate: '2025-11-08', size: '3.3 MB', tags: ['mortgage', 'contract'], referenceNumber: 'MORT-2025-55432' },
            { id: 'doc-017', name: 'Life Insurance Policy', category: 'Insurance', fileType: 'pdf', uploadDate: '2025-11-08', expiryDate: '2055-11-07', size: '2.1 MB', tags: ['life-insurance'] }
          ]
        },
        {
          id: 'ss-002-3',
          title: 'Insurance',
          icon: '🛡️',
          description: 'Home and contents insurance',
          isRequired: true,
          documents: [
            { id: 'doc-018', name: 'Home Insurance Policy', category: 'Insurance', fileType: 'pdf', uploadDate: '2025-11-10', expiryDate: '2027-01-14', size: '2.7 MB', tags: ['home-insurance'], referenceNumber: 'HOME-INS-448821' },
            { id: 'doc-019', name: 'Contents Insurance', category: 'Insurance', fileType: 'pdf', uploadDate: '2025-11-15', expiryDate: '2026-11-14', size: '1.4 MB', tags: ['contents-insurance'] }
          ]
        },
        {
          id: 'ss-002-4',
          title: 'Inspection Reports',
          icon: '🔍',
          description: 'Building inspection and structural reports',
          isRequired: false,
          documents: [
            { id: 'doc-020', name: 'Building Inspection Report', category: 'Other', fileType: 'pdf', uploadDate: '2025-09-28', size: '8.2 MB', tags: ['inspection', 'bouwkundig'] },
            { id: 'doc-021', name: 'Energy Certificate (EPA)', category: 'Government', fileType: 'pdf', uploadDate: '2025-10-01', size: '0.9 MB', tags: ['energy', 'epa'] }
          ]
        }
      ]
    },
    {
      id: 'evt-003',
      title: 'New Job at TechCorp NL',
      type: 'Employment',
      status: 'Active',
      eventDate: '2026-01-06',
      description: 'Senior Developer position at TechCorp Netherlands B.V.',
      emoji: '💼',
      colorClass: 'purple',
      tags: ['employment', 'techcorp', 'contract', 'salary'],
      subSections: [
        {
          id: 'ss-003-1',
          title: 'Contract & Offer',
          icon: '📋',
          description: 'Employment contract and offer letter',
          isRequired: true,
          documents: [
            { id: 'doc-022', name: 'Employment Contract', category: 'Contract', fileType: 'pdf', uploadDate: '2025-12-20', size: '1.9 MB', tags: ['contract', 'employment'], referenceNumber: 'TC-HR-2025-441' },
            { id: 'doc-023', name: 'Offer Letter', category: 'Contract', fileType: 'pdf', uploadDate: '2025-12-15', size: '0.6 MB', tags: ['offer'] },
            { id: 'doc-024', name: 'Job Description', category: 'Other', fileType: 'pdf', uploadDate: '2025-12-15', size: '0.4 MB', tags: ['job-description'] }
          ]
        },
        {
          id: 'ss-003-2',
          title: 'Payroll & Benefits',
          icon: '💰',
          description: 'Salary slips and benefits documentation',
          isRequired: true,
          documents: [
            { id: 'doc-025', name: 'Salary Slip January 2026', category: 'Finance', fileType: 'pdf', uploadDate: '2026-01-31', size: '0.3 MB', tags: ['salary', 'payslip'] },
            { id: 'doc-026', name: 'Pension Agreement', category: 'Contract', fileType: 'pdf', uploadDate: '2026-01-10', size: '2.1 MB', tags: ['pension'] }
          ]
        },
        {
          id: 'ss-003-3',
          title: 'Onboarding',
          icon: '🚀',
          description: 'Onboarding documents and NDAs',
          isRequired: true,
          documents: [
            { id: 'doc-027', name: 'NDA Agreement', category: 'Contract', fileType: 'pdf', uploadDate: '2026-01-06', size: '0.8 MB', tags: ['nda', 'confidentiality'] },
            { id: 'doc-028', name: 'IT Equipment Agreement', category: 'Other', fileType: 'pdf', uploadDate: '2026-01-07', size: '0.5 MB', tags: ['equipment', 'laptop'] }
          ]
        }
      ]
    },
    {
      id: 'evt-004',
      title: 'Home Renovation 2025',
      type: 'Renovation',
      status: 'Completed',
      eventDate: '2025-06-01',
      description: 'Kitchen and bathroom full renovation at home',
      emoji: '🏗️',
      colorClass: 'amber',
      tags: ['renovation', 'kitchen', 'bathroom', 'contractor'],
      subSections: [
        {
          id: 'ss-004-1',
          title: 'Contractor Agreement',
          icon: '🤝',
          description: 'Contractor contracts and quotes',
          isRequired: true,
          documents: [
            { id: 'doc-029', name: 'Renovation Contract', category: 'Contract', fileType: 'pdf', uploadDate: '2025-05-10', size: '2.2 MB', tags: ['contract', 'renovation'], referenceNumber: 'REN-2025-7732' },
            { id: 'doc-030', name: 'Approved Quote', category: 'Finance', fileType: 'pdf', uploadDate: '2025-05-08', size: '1.1 MB', tags: ['quote'] }
          ]
        },
        {
          id: 'ss-004-2',
          title: 'Permits',
          icon: '📄',
          description: 'Government permits and approvals',
          isRequired: true,
          documents: [
            { id: 'doc-031', name: 'Building Permit', category: 'Government', fileType: 'pdf', uploadDate: '2025-05-20', size: '0.7 MB', tags: ['permit', 'bouwvergunning'] }
          ]
        },
        {
          id: 'ss-004-3',
          title: 'Invoices & Payments',
          icon: '🧾',
          description: 'All payment receipts and invoices',
          isRequired: true,
          documents: [
            { id: 'doc-032', name: 'Final Invoice - Contractor', category: 'Finance', fileType: 'pdf', uploadDate: '2025-09-15', size: '0.9 MB', tags: ['invoice', 'final'] },
            { id: 'doc-033', name: 'Materials Invoice', category: 'Finance', fileType: 'pdf', uploadDate: '2025-07-10', size: '1.3 MB', tags: ['materials', 'invoice'] },
            { id: 'doc-034', name: 'Payment Receipt', category: 'Finance', fileType: 'pdf', uploadDate: '2025-09-20', size: '0.2 MB', tags: ['receipt', 'payment'] }
          ]
        },
        {
          id: 'ss-004-4',
          title: 'Warranties',
          icon: '🔒',
          description: 'Product and workmanship warranties',
          isRequired: false,
          documents: [
            { id: 'doc-035', name: 'Kitchen Warranty Certificate', category: 'Warranty', fileType: 'pdf', uploadDate: '2025-09-20', expiryDate: '2027-09-20', size: '0.8 MB', tags: ['warranty', 'kitchen'] },
            { id: 'doc-036', name: 'Workmanship Guarantee', category: 'Warranty', fileType: 'pdf', uploadDate: '2025-09-15', expiryDate: '2027-09-15', size: '0.5 MB', tags: ['guarantee', 'contractor'] }
          ]
        }
      ]
    },
    {
      id: 'evt-005',
      title: 'Health - Knee Surgery',
      type: 'Medical',
      status: 'Completed',
      eventDate: '2025-08-14',
      description: 'ACL reconstruction surgery at Amsterdam Medical Center',
      emoji: '🏥',
      colorClass: 'rose',
      tags: ['medical', 'surgery', 'insurance', 'amc'],
      subSections: [
        {
          id: 'ss-005-1',
          title: 'Medical Records',
          icon: '📋',
          description: 'Diagnosis, treatment plans and reports',
          isRequired: true,
          documents: [
            { id: 'doc-037', name: 'Diagnosis Report', category: 'Other', fileType: 'pdf', uploadDate: '2025-06-10', size: '1.2 MB', tags: ['diagnosis', 'mri'] },
            { id: 'doc-038', name: 'Surgery Report', category: 'Other', fileType: 'pdf', uploadDate: '2025-08-14', size: '0.9 MB', tags: ['surgery', 'report'] },
            { id: 'doc-039', name: 'Discharge Summary', category: 'Other', fileType: 'pdf', uploadDate: '2025-08-16', size: '0.6 MB', tags: ['discharge'] }
          ]
        },
        {
          id: 'ss-005-2',
          title: 'Insurance Claims',
          icon: '💊',
          description: 'Insurance reimbursement and claim documents',
          isRequired: true,
          documents: [
            { id: 'doc-040', name: 'Health Insurance Claim', category: 'Insurance', fileType: 'pdf', uploadDate: '2025-09-01', size: '1.5 MB', tags: ['claim', 'zorgverzekering'], referenceNumber: 'CLAIM-2025-44210' },
            { id: 'doc-041', name: 'Reimbursement Confirmation', category: 'Finance', fileType: 'pdf', uploadDate: '2025-09-20', size: '0.4 MB', tags: ['reimbursement'] }
          ]
        },
        {
          id: 'ss-005-3',
          title: 'Prescriptions',
          icon: '💉',
          description: 'Prescriptions and medication records',
          isRequired: false,
          documents: [
            { id: 'doc-042', name: 'Post-surgery Prescription', category: 'Other', fileType: 'pdf', uploadDate: '2025-08-16', size: '0.3 MB', tags: ['prescription'] }
          ]
        }
      ]
    },
    {
      id: 'evt-006',
      title: 'Travel Visa - Japan 2026',
      type: 'Travel',
      status: 'Pending',
      eventDate: '2026-07-01',
      description: 'Summer holiday trip to Japan - 3 weeks',
      emoji: '✈️',
      colorClass: 'teal',
      tags: ['travel', 'japan', 'visa', 'holiday'],
      subSections: [
        {
          id: 'ss-006-1',
          title: 'Visa Application',
          icon: '🛂',
          description: 'Visa application and approval documents',
          isRequired: true,
          documents: [
            { id: 'doc-043', name: 'Visa Application Form', category: 'Government', fileType: 'pdf', uploadDate: '2026-04-10', size: '0.8 MB', tags: ['visa', 'application'] },
            { id: 'doc-044', name: 'Visa Approval Letter', category: 'Government', fileType: 'pdf', uploadDate: '2026-04-28', expiryDate: '2026-07-30', size: '0.5 MB', tags: ['visa', 'approval'], referenceNumber: 'VISA-JP-2026-8812' }
          ]
        },
        {
          id: 'ss-006-2',
          title: 'Travel Documents',
          icon: '🗺️',
          description: 'Passport, tickets and hotel bookings',
          isRequired: true,
          documents: [
            { id: 'doc-045', name: 'Passport Copy', category: 'Government', fileType: 'jpg', uploadDate: '2026-04-08', expiryDate: '2029-03-22', size: '1.2 MB', tags: ['passport'] },
            { id: 'doc-046', name: 'Flight Tickets', category: 'Finance', fileType: 'pdf', uploadDate: '2026-04-15', size: '0.6 MB', tags: ['flights', 'tickets'], referenceNumber: 'KL-2026-AMS-TYO' },
            { id: 'doc-047', name: 'Hotel Reservations', category: 'Other', fileType: 'pdf', uploadDate: '2026-04-15', size: '0.9 MB', tags: ['hotel', 'booking'] }
          ]
        },
        {
          id: 'ss-006-3',
          title: 'Travel Insurance',
          icon: '🛡️',
          description: 'Travel insurance policy',
          isRequired: true,
          documents: [
            { id: 'doc-048', name: 'Travel Insurance Policy', category: 'Insurance', fileType: 'pdf', uploadDate: '2026-04-20', expiryDate: '2026-07-22', size: '2.1 MB', tags: ['travel-insurance'], referenceNumber: 'TRVL-INS-2026-3301' }
          ]
        }
      ]
    }
  ];

  getEvents(): AppEvent[] {
    return this.events;
  }

  getEventById(id: string): AppEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  getTotalDocCount(): number {
    return this.events.reduce((sum, e) =>
      sum + e.subSections.reduce((s, ss) => s + ss.documents.length, 0), 0);
  }

  createEvent(data: { title: string; type: string; description: string; date: Date }): AppEvent {
    const newId = `evt-${String(this.events.length + 1).padStart(3, '0')}`;
    const newEvent: AppEvent = {
      id: newId,
      title: data.title,
      type: data.type,
      status: 'Active',
      eventDate: data.date.toISOString().split('T')[0],
      description: data.description,
      emoji: this.getEmojiForType(data.type),
      colorClass: this.getColorForType(data.type),
      tags: [data.title.toLowerCase().replace(/\s+/g, '-')],
      subSections: []
    };
    this.events.push(newEvent);
    return newEvent;
  }

  private getEmojiForType(type: string): string {
    const emojiMap: Record<string, string> = {
      'Vehicle Purchase': '🚗',
      'Property Purchase': '🏠',
      'Medical': '🏥',
      'Travel': '✈️',
      'Job': '💼',
      'Renovation': '🏗️',
      'Other': '📦'
    };
    return emojiMap[type] || '📦';
  }

  private getColorForType(type: string): string {
    const colorMap: Record<string, string> = {
      'Vehicle Purchase': 'blue',
      'Property Purchase': 'green',
      'Medical': 'rose',
      'Travel': 'teal',
      'Job': 'purple',
      'Renovation': 'amber',
      'Other': 'gray'
    };
    return colorMap[type] || 'gray';
  }

  getExpiringDocuments(daysAhead = 120): { doc: DocFile; eventTitle: string; subSectionName: string }[] {
    const result: { doc: DocFile; eventTitle: string; subSectionName: string }[] = [];
    const today = new Date();
    const cutoff = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    for (const event of this.events) {
      for (const ss of event.subSections) {
        for (const doc of ss.documents) {
          if (doc.expiryDate) {
            const expiry = new Date(doc.expiryDate);
            if (expiry <= cutoff && expiry >= today) {
              result.push({ doc, eventTitle: event.title, subSectionName: ss.title });
            }
          }
        }
      }
    }
    return result.sort((a, b) => new Date(a.doc.expiryDate!).getTime() - new Date(b.doc.expiryDate!).getTime());
  }

  getMockChatResponse(question: string): string {
    const q = question.toLowerCase();
    const totalDocs = this.getTotalDocCount();
    const totalEvents = this.events.length;

    if (q.includes('rdw')) {
      return '📄 Found: **RDW Registration Document** in "Buy KIA EV6" → Government & Registration.\n\nReference: RDW-EV6-2026-88123\nUploaded: March 20, 2026\nFile size: 1.1 MB';
    }
    if (q.includes('meld')) {
      return '📄 Found: **Meld Code Certificate** in "Buy KIA EV6" → Government & Registration.\n\nUploaded: March 20, 2026 as an image (JPG).\nTip: Consider requesting a PDF version from the dealer for better archiving.';
    }
    if (q.includes('insurance') || q.includes('verzekering')) {
      return '🛡️ You have **5 insurance documents** across your events:\n\n1. Insurance Policy AllRisk (KIA EV6) — expires Mar 17, 2027\n2. Green Card (KIA EV6) — expires Mar 17, 2027\n3. Home Insurance (Amsterdam) — expires Jan 14, 2027\n4. Travel Insurance (Japan) — expires Jul 22, 2026\n5. Life Insurance (Mortgage) — expires 2055';
    }
    if (q.includes('expir') || q.includes('renew') || q.includes('deadline')) {
      return '⏰ Upcoming expirations:\n\n• Travel Insurance - Japan (Jul 22, 2026) — ⚠️ Soon!\n• Visa Approval - Japan (Jul 30, 2026) — ⚠️ Soon!\n• Contents Insurance - Amsterdam (Nov 14, 2026)\n• Home Insurance - Amsterdam (Jan 14, 2027)\n• Insurance AllRisk - KIA EV6 (Mar 17, 2027)';
    }
    if (q.includes('warranty') || q.includes('garantie')) {
      return '🔒 Active warranties:\n\n1. KIA Warranty Certificate — valid until Mar 15, 2032\n2. KIA Service Plan — valid until Mar 15, 2029\n3. Kitchen Warranty — valid until Sep 20, 2027\n4. Workmanship Guarantee — valid until Sep 15, 2027';
    }
    if (q.includes('contract')) {
      return '📋 Found **7 contracts** across your events:\n\n1. Signed Dealer Contract (KIA EV6)\n2. Preliminary Purchase Agreement (House)\n3. Mortgage Agreement (House)\n4. Employment Contract (TechCorp)\n5. NDA Agreement (TechCorp)\n6. Renovation Contract (Home Reno)\n7. Trade-in Agreement (KIA EV6)';
    }
    if (q.includes('japan') || q.includes('visa') || q.includes('travel')) {
      return '✈️ Travel Visa - Japan 2026 event has **6 documents** in 3 sections:\n\n📂 Visa Application: Application Form + Approval Letter (exp. Jul 30)\n📂 Travel Documents: Passport, Flight Tickets, Hotel Reservations\n📂 Travel Insurance: Policy (exp. Jul 22)';
    }
    if (q.includes('house') || q.includes('huis') || q.includes('mortgage') || q.includes('notaris')) {
      return '🏠 House Purchase Amsterdam is **Completed** with 9 documents:\n\n• Notarial Deed of Transfer\n• Mortgage Agreement (ref: MORT-2025-55432)\n• Home Insurance (exp. Jan 14, 2027)\n• Building Inspection Report\n• Energy Certificate (EPA)\n• And 4 more documents';
    }
    if (q.includes('kia') || q.includes('car') || q.includes('ev6') || q.includes('auto')) {
      return '🚗 Buy KIA EV6 event has **11 documents** across 5 sub-sections:\n\n📂 Dealer & Contract: 3 docs\n📂 Government & Registration: 2 docs (RDW + Meld code)\n📂 Insurance: 2 docs (AllRisk + Green Card)\n📂 Finance: 2 docs\n📂 Warranty & Service: 2 docs';
    }
    if (q.includes('how many') || q.includes('total') || q.includes('count')) {
      return `📊 Document overview:\n\n• Total events: **${totalEvents}**\n• Total documents: **${totalDocs}**\n• Active events: 2\n• Completed events: 3\n• Pending events: 1\n\nAsk me about a specific event or document type!`;
    }
    if (q.includes('job') || q.includes('techcorp') || q.includes('salary') || q.includes('employment')) {
      return '💼 New Job at TechCorp NL is **Active** with 8 documents:\n\n• Employment Contract (ref: TC-HR-2025-441)\n• Salary Slip January 2026\n• NDA Agreement\n• Pension Agreement\n• And more onboarding docs';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `👋 Hello! I'm your document assistant.\n\nYou have **${totalEvents} events** and **${totalDocs} documents** stored.\n\nYou can ask me things like:\n• "Show my insurance documents"\n• "What expires soon?"\n• "Find the RDW document"\n• "How many contracts do I have?"`;
    }
    return `🔍 I searched through **${totalDocs} documents** across **${totalEvents} events**.\n\nI didn't find an exact match for "${question}". Try asking about:\n• A document type (insurance, contract, warranty)\n• An event (KIA EV6, house, Japan)\n• Deadlines (expiry, renewal)\n• Specific docs (RDW, meld code, passport)`;
  }
}

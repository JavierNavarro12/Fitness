import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.custom': 'Personalize',
      'nav.reports': 'Reports',
      'nav.categories': 'Categories',
      'search.placeholder': 'Search...',
      'home.welcome': 'Welcome to EGN',
      'home.description':
        'EGN is your intelligent sports supplementation advisor. Personalize your profile, generate professional reports, and resolve your doubts with our expert AI. Optimize your performance and health with recommendations based on your profile and goals!',
      'home.cta.ready': 'Ready to start?',
      'home.cta.goTo': 'Go to the',
      'home.cta.personalize': 'Personalization',
      'home.cta.getRecommendations':
        'section to create your profile and get personalized recommendations.',
      'home.cta.button': 'Start Now',
      'deportes.title': 'Performance by Sport',
      'deportes.description':
        'Each discipline has its own demands. Discover which supplements are most effective for your sport, whether you seek strength, endurance, or faster recovery.',
      'deportes.card.suplementos': 'Key Supplements',
      'deportes.stats.title': 'Sport Statistics',
      'deportes.stats.fitness':
        '67% of fitness practitioners report significant strength improvements with proper supplementation',
      'deportes.stats.crossfit':
        'CrossFit athletes using specific supplements improve their performance by 23%',
      'deportes.stats.resistencia':
        '89% of marathon runners use supplements to optimize their performance',
      'deportes.stats.equipo':
        'Team athletes who supplement correctly reduce their recovery time by 40%',
      'salud.title': 'Health & Wellness',
      'salud.description':
        'A solid foundation of health is essential for any fitness goal. Here you will find supplements that support your overall well-being, from vitamins to antioxidants.',
      'salud.card.puntosClave': 'Key Points',
      'salud.stats.title': 'Global Health Data',
      'salud.stats.vitaminas':
        '42% of the world population is deficient in vitamin D',
      'salud.stats.minerales':
        '75% of people do not consume enough magnesium daily',
      'salud.stats.omega3':
        'Only 10% of the population consumes the recommended amount of Omega-3',
      'grasa.title': 'Smart Fat Burning',
      'grasa.description':
        'Discover the most effective supplements and strategies to optimize fat loss in a healthy and sustainable way.',
      'grasa.card.suplementos': 'Key Supplements',
      'grasa.l-carnitina.title': 'L-Carnitine',
      'grasa.l-carnitina.content':
        'Facilitates the transport of fatty acids to the mitochondria for energy production. Especially useful in endurance training and fat loss phases.',
      'grasa.cla.title': 'CLA (Conjugated Linoleic Acid)',
      'grasa.cla.content':
        'Helps reduce body fat and maintain muscle mass during weight loss. Its effect is greater when combined with exercise and a healthy diet.',
      'grasa.te-verde.title': 'Green Tea Extract',
      'grasa.te-verde.content':
        'Rich in catechins and caffeine, it increases metabolism and fat oxidation. Also provides antioxidant benefits.',
      'grasa.cafeina.title': 'Caffeine',
      'grasa.cafeina.content':
        'Stimulates metabolism, increases energy expenditure, and improves performance during exercise. Helps mobilize fat for use as energy.',
      'grasa.puntos-clave': 'Key Points',
      'mujer.title': "Women's Health & Wellness",
      'mujer.description':
        'Women have unique nutritional and physiological needs. This section focuses on key supplements to support hormonal, bone, and overall female wellness.',
      'mujer.stats.title': "Women's Health in Numbers",
      'mujer.stats.fundamentos':
        '85% of women do not consume enough calcium to prevent osteoporosis',
      'mujer.stats.equilibrio':
        '70% of women experience hormonal imbalances at some point in their lives',
      'mujer.stats.escucha':
        '60% of women who listen to their bodies improve their overall well-being',
      'cognitivo.title': 'Cognitive Performance',
      'cognitivo.description':
        'Your brain is your most important asset. Discover how supplementation can enhance your focus, memory, and stress resistance for maximum mental performance.',
      'cognitivo.stats.title': 'Brain Data',
      'cognitivo.stats.nootropicos':
        'Nootropics can improve working memory by 15-25%',
      'cognitivo.stats.adaptogenos':
        '80% of people who use adaptogens report better stress management',
      'cognitivo.stats.salud':
        'Brain supplementation can reduce cognitive decline by 30%',
      'cognitivo.stats.estrategias':
        'Cognitive optimization strategies improve productivity by 40%',
      'footer.nav.title': 'Navigation',
      'footer.nav.home': 'Home',
      'footer.nav.deportes': 'Sports',
      'footer.nav.salud': 'Health & Wellness',
      'footer.nav.grasa': 'Fat Burning',
      'footer.nav.mujer': 'Women Specific',
      'footer.nav.cognitivo': 'Cognitive Performance',
      'footer.services.title': 'Services',
      'footer.services.custom': 'Personalization',
      'footer.services.reports': 'My Reports',
      'footer.services.faq': 'FAQ',
      'footer.contact.title': 'Contact',
      'footer.contact.form': 'Contact Form',
      'footer.contact.location': 'Granada, España',
      'footer.tagline': 'Your intelligent fitness partner',
      'footer.copyright': 'All rights reserved',
      'footer.legal.terms': 'Terms of Service',
      'footer.legal.privacy': 'Privacy Policy',
      'megaMenu.conocenos': 'About Us',
      'megaMenu.deportes': 'Sports',
      'megaMenu.salud': 'Health',
      'megaMenu.grasa': 'Fat Burn',
      'megaMenu.mujer': 'Women Specific',
      'megaMenu.cognitivo': 'Cognitive Performance',
      'salud.vitaminas.title': 'Essential Vitamins',
      'salud.minerales.title': 'Key Minerals',
      'salud.antioxidantes.title': 'Antioxidants and Omega-3',
      'deportes.pesas.title': 'Fitness',
      'deportes.crossfit.title': 'Crossfit / HIIT',
      'deportes.resistencia.title': 'Cycling / Running / Endurance Sports',
      'deportes.equipo.title': 'Team Sports',
      'grasa.termogenicos.title': 'Thermogenics and Metabolism',
      'grasa.metabolismo-energetico.title': 'Energetic Metabolism',
      'grasa.metabolismo-energetico.content':
        'L-Carnitine: Facilitates the transport of fatty acids to the mitochondria for energy use. Magnesium: Essential for over 300 metabolic reactions, including energy production. Omega-3: Improves insulin sensitivity and supports fat metabolism. Vitamin D: Linked to better body composition and active metabolism. Regular exercise: Increases caloric expenditure and metabolic efficiency.',
      'grasa.apetito.title': 'Appetite Control',
      'grasa.fundamentos.title': 'Fundamentals of Fat Burning',
      'mujer.fundamentos.title': 'Fundamentals for Women',
      'mujer.equilibrio.title': 'Hormonal Balance and Skin',
      'mujer.escucha.title': 'Listen to your Body',
      'cognitivo.nootropicos.title': 'Nootropics: Boost your Focus',
      'cognitivo.adaptogenos.title': 'Adaptogens and Stress',
      'cognitivo.salud.title': 'Long-term Brain Health',
      'cognitivo.estrategias.title': 'Cognitive Optimization Strategies',
      'bottomNav.profile': 'Profile',
      'salud.vitaminas.content':
        'Vitamin D: For bone health and immunity. B-complex vitamins: Essential for energy and metabolism. Vitamin C: Powerful antioxidant. Vitamin A: For visual and skin health. Vitamin E: Protects cells from oxidative damage. Vitamin K: Essential for blood clotting and bone health.',
      'salud.minerales.content':
        'Magnesium: For muscle recovery and sleep. Zinc: Key for testosterone and immunity. Iron: Essential for oxygen transport, especially in women. Calcium: For bone health and muscle contraction. Selenium: Antioxidant and thyroid support. Potassium: For electrolyte balance and muscle function.',
      'salud.antioxidantes.content':
        "Omega-3: Reduces inflammation and improves cardiovascular health. Coenzyme Q10: Vital for cellular energy. Turmeric: Powerful anti-inflammatory. Resveratrol: Protects against cellular aging. Astaxanthin: Antioxidant more potent than vitamin E. Glutathione: The body's master antioxidant.",
      'salud.proteina.title': 'Essential Proteins',
      'salud.proteina.content':
        'Whey Protein: Fundamental for muscle synthesis and recovery. Collagen: For joint, skin, and connective tissue health. Casein Protein: Slow release for overnight recovery. Egg Protein: High bioavailability and complete amino acid profile. Plant Protein: Option for vegan and vegetarian diets.',
      'salud.probioticos.title': 'Probiotics and Digestive Health',
      'salud.probioticos.content':
        'Lactobacillus: For digestive and immune health. Bifidobacterium: Improves nutrient absorption. Saccharomyces Boulardii: Protects against digestive infections. Prebiotics: Feed beneficial gut bacteria. Digestive Enzymes: Improve digestion and nutrient absorption.',
      'deportes.pesas.content':
        'Creatine: Improves strength and power. BCAAs: Reduces muscle fatigue. Beta-Alanine: Increases endurance during short and intense efforts.',
      'deportes.crossfit.content':
        'HMB: Prevents muscle breakdown. Citrulline Malate: Improves blood flow and reduces fatigue. Taurine: Supports cell hydration and metabolism.',
      'deportes.resistencia.content':
        'Electrolytes: For proper hydration. Beta-Alanine: Helps delay muscle fatigue during prolonged efforts. Caffeine: Improves focus and reduces perception of effort.',
      'deportes.equipo.content':
        'Glutamine: Supports recovery and the immune system. Arginine: Improves blood flow. Nitrates (from beet): Enhance efficiency in oxygen use.',
      'grasa.termogenicos.content':
        'Green Tea Extract: Increases metabolism by 3-4%. Cayenne Pepper: Increases body temperature and calorie burning. Synephrine: Stimulant that can increase fat burning. Caffeine: Speeds up metabolism and improves performance. L-Carnitine: Transports fatty acids to be used as energy. CLA: May reduce body fat and preserve muscle mass.',
      'grasa.apetito.content':
        'Glucomannan: Soluble fiber that promotes satiety. Garcinia Cambogia: May block fat production. 5-HTP: Helps regulate appetite and mood.',
      'grasa.fundamentos.content':
        'L-Carnitine: Helps transport fatty acids to be used as energy. CLA (Conjugated Linoleic Acid): May reduce body fat. Green Tea Extract: Contains catechins that help speed up metabolism and increase fat oxidation.',
      'mujer.fundamentos.content':
        'Folic Acid: Essential for cellular health. Calcium: Key for bone health, especially after menopause. Iron: To prevent anemia, common in women.',
      'mujer.equilibrio.content':
        'DIM (Diindolylmethane): Helps balance estrogen. Vitex Agnus-Castus: Can regulate menstrual cycles. Collagen: For healthy skin, hair, and nails.',
      'mujer.escucha.content':
        'Evening Primrose Oil: May alleviate premenstrual symptoms. Probiotics: For digestive and vaginal health. Ashwagandha: Adaptogen to manage stress.',
      'cognitivo.nootropicos.content':
        'L-Theanine and Caffeine: Synergistic combination for calm focus and without nervousness. Bacopa Monnieri: An adaptogenic herb that improves memory and reduces anxiety with continued use. Ginkgo Biloba: Known for improving circulation and cognitive function.',
      'cognitivo.adaptogenos.content':
        'Rhodiola Rosea: Fights mental and physical fatigue. Panax Ginseng: Improves memory and mood. Cordyceps: May increase energy and oxygen utilization.',
      'cognitivo.salud.content':
        "Phosphatidylserine: Key for cognitive function. Lion's Mane: Mushroom that can stimulate nerve growth. DHA (Omega-3): Essential for brain structure.",
      'cognitivo.estrategias.content':
        'Intermittent Fasting: May improve mental clarity. Quality Sleep: Essential for memory consolidation. Meditation: Reduces stress and improves focus.',
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle':
        'Find answers to the most common questions about EGN Fitness',
      'faq.q1': 'What is EGN Fitness?',
      'faq.a1':
        'EGN (Endless Goals Nutrition) is your intelligent sports supplementation advisor. We use advanced AI to create personalized recommendations based on your profile, goals, and specific needs.',
      'faq.q2': 'How does personalization work?',
      'faq.a2':
        'You fill out a detailed form with your personal information, sport, experience, goals, and medical conditions. Our AI analyzes this data to generate specific recommendations for you.',
      'faq.q3': 'Are the recommendations safe?',
      'faq.a3':
        'Our recommendations are general suggestions based on scientific evidence. We always recommend consulting a healthcare professional before starting any supplementation, especially if you have medical conditions.',
      'faq.q4': 'What sports does the app cover?',
      'faq.a4':
        'We cover a wide range of sports: from weightlifting and bodybuilding to endurance sports like running and cycling, team sports, CrossFit, yoga, and many more.',
      'faq.q5': "Can I use the app if I'm a beginner?",
      'faq.a5':
        'Absolutely! Our recommendations adapt to all levels, from beginners to advanced athletes. Supplementation is adjusted according to your experience and goals.',
      'faq.q6': 'How are the reports generated?',
      'faq.a6':
        'We use advanced artificial intelligence to analyze your profile and generate detailed reports that include specific recommendations, suggested doses, and optimal times to take each supplement.',
      'faq.q7': 'Are the recommended supplements legal?',
      'faq.a7':
        'We only recommend legal and approved supplements. Our recommendations are based on products available on the market that comply with safety regulations.',
      'faq.q8': 'Can I modify my profile later?',
      'faq.a8':
        "Yes, you can edit your profile at any time from the 'My Profile' section. Changes will be reflected in future recommendations.",
      'faq.q9': 'What if I have allergies or medical conditions?',
      'faq.a9':
        'It is crucial that you include this information in your profile. Our AI will consider these limitations to avoid recommendations that may be harmful to your health.',
      'faq.q10': 'How do I contact support?',
      'faq.a10':
        'You can contact us by email at endlessgoalsnutrition@gmail.com or follow us on our social networks for the latest updates and tips.',
      'faq.notFoundTitle': "Can't find your answer?",
      'faq.notFoundText':
        'Our team is here to help you. Feel free to contact us.',
      'faq.contactButton': 'Go to Contact Form',
      'terms.title': 'Terms of Service',
      'terms.lastUpdate': 'Last update: {{date}}',
      'terms.section1.title': '1. Acceptance of Terms',
      'terms.section1.text':
        'By accessing and using EGN Fitness (Endless Goals Nutrition), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.',
      'terms.section2.title': '2. Service Description',
      'terms.section2.text':
        'EGN Fitness is a sports supplementation advisory platform that uses artificial intelligence to provide personalized recommendations based on your profile and goals.',
      'terms.section2.important':
        'Our recommendations are informative and do not replace professional medical advice. Always consult a healthcare professional before starting any supplementation.',
      'terms.section3.title': '3. Responsible Use',
      'terms.section3.item1':
        '• You must provide accurate and up-to-date information in your profile',
      'terms.section3.item2':
        '• You must not use the service if you are under 18 without parental supervision',
      'terms.section3.item3':
        '• You are responsible for consulting healthcare professionals before following our recommendations',
      'terms.section3.item4':
        '• You must not use the service for illegal or unauthorized purposes',
      'terms.section4.title': '4. Limitations of Liability',
      'terms.section4.text': 'EGN Fitness is not responsible for:',
      'terms.section4.item1':
        '• Any adverse effects resulting from the use of recommended supplements',
      'terms.section4.item2':
        '• Interactions with medications or existing medical conditions',
      'terms.section4.item3': '• Specific performance or health outcomes',
      'terms.section4.item4': '• Service interruptions or data loss',
      'terms.section5.title': '5. Privacy and Data',
      'terms.section5.text':
        'Your privacy is important to us. We collect and process personal data only to provide our services. See our Privacy Policy for more details on how we handle your information.',
      'terms.section6.title': '6. Intellectual Property',
      'terms.section6.text':
        'All content, algorithms, and technology of EGN Fitness are protected by copyright and other intellectual property laws. You may not copy, distribute, or modify our content without authorization.',
      'terms.section7.title': '7. Modifications',
      'terms.section7.text':
        'We reserve the right to modify these terms at any time. Changes will take effect immediately upon publication. We recommend reviewing these terms periodically.',
      'terms.section8.title': '8. Contact',
      'terms.section8.text':
        'If you have questions about these terms, you can contact us at: Email: endlessgoalsnutrition@gmail.com',
      'terms.legalNoticeTitle': 'Important Legal Notice',
      'terms.legalNoticeText':
        'The recommendations provided by EGN Fitness are for informational and educational purposes only. They do not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before starting any supplementation program.',
      'privacy.title': 'Privacy Policy',
      'privacy.lastUpdate': 'Last update: {{date}}',
      'privacy.section1.title': '1. Information We Collect',
      'privacy.section2.title': '2. How We Use Your Information',
      'privacy.section2.text':
        '• Generate personalized supplementation recommendations • Improve our algorithms and services • Provide customer support • Send important service updates • Comply with legal obligations',
      'privacy.section3.title': '3. Sharing Information',
      'privacy.section3.strong':
        'We do not sell, rent, or share your personal information',
      'privacy.section3.text':
        'with third parties, except in the following cases:',
      'privacy.section3.case1': '• With your explicit consent',
      'privacy.section3.case2': '• To comply with legal obligations',
      'privacy.section3.case3':
        '• With service providers who help us operate the platform (under strict confidentiality agreements)',
      'privacy.section3.case4':
        '• In case of medical emergency (only relevant information)',
      'privacy.section4.title': '4. Data Security',
      'privacy.section4.text':
        'We implement technical and organizational security measures to protect your information:',
      'privacy.section4.case1': '• Data encryption in transit and at rest',
      'privacy.section4.case2': '• Restricted access to personal information',
      'privacy.section4.case3': '• Regular security monitoring',
      'privacy.section4.case4': '• Secure backups',
      'privacy.section5.title': '5. Your Rights',
      'privacy.section5.case1':
        '• Access: You can request a copy of your personal data',
      'privacy.section5.case2':
        '• Rectification: You can correct inaccurate information',
      'privacy.section5.case3':
        '• Deletion: You can request the deletion of your data',
      'privacy.section5.case4':
        '• Portability: You can request the transfer of your data',
      'privacy.section5.case5':
        '• Objection: You can object to the processing of your data',
      'privacy.section6.title': '6. Data Retention',
      'privacy.section6.text':
        'We retain your personal information only as long as necessary to fulfill the purposes described in this policy, or as required by law. Data is securely deleted when no longer needed.',
      'privacy.section7.title': '7. Cookies and Similar Technologies',
      'privacy.section7.text':
        'We use cookies and similar technologies to enhance your experience, analyze app usage, and personalize content. You can control the use of cookies through your browser settings.',
      'privacy.section8.title': '8. Minors',
      'privacy.section8.text':
        'Our service is not directed to minors under 18. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with information, contact us immediately.',
      'privacy.section9.title': '9. Changes to this Policy',
      'privacy.section9.text':
        'We may update this privacy policy from time to time. We will notify you of significant changes by email or through the app. We recommend reviewing this policy periodically.',
      'privacy.section10.title': '10. Contact',
      'privacy.section10.text':
        'If you have questions about this privacy policy or how we handle your data, you can contact us at: Email: endlessgoalsnutrition@gmail.com',
      'privacy.compromiso': 'Our Privacy Commitment',
      'privacy.compromisoText':
        'At EGN Fitness, your privacy is fundamental. We are committed to protecting your personal information and being transparent about how we use it. If you have any concerns, please contact us.',
      'report.title': 'Personalized Report',
      'report.copy': 'Copy',
      'report.copied': 'Copied!',
      'report.generatingPDF': 'Generating PDF...',
      'report.downloadPDF': 'Download PDF',
      'report.delete': 'Delete report',
      'report.linksTitle': 'Links to recommended products:',
      'stepForm.personalInfo': 'Personal Information',
      'stepForm.bodyMeasures': 'Body Measurements',
      'stepForm.sportExperience': 'Sports Experience',
      'stepForm.healthGoals': 'Health and Goals',
      'stepForm.errorX': 'Please check the required fields.',
      'userDrawer.title': 'My Account',
      'userDrawer.guest': 'Guest',
      'userDrawer.login': 'Log in',
      'userDrawer.register': 'Register',
      'userDrawer.profile': 'View profile',
      'userDrawer.logout': 'Log out',
      'privacy.section1.subtitle1': 'Personal Information',
      'privacy.section1.item1':
        '• Profile data: age, gender, weight, height, sport, experience',
      'privacy.section1.item2':
        '• Contact information: email (for authentication)',
      'privacy.section1.item3':
        '• Medical information: medical conditions, allergies, current supplements',
      'privacy.section1.subtitle2': 'Usage Information',
      'privacy.section1.item4': '• History of generated reports',
      'privacy.section1.item5': '• Application preferences',
      'privacy.section1.item6': '• Navigation and platform usage data',
      'stepForm.age': 'Age',
      'stepForm.gender': 'Gender',
      'stepForm.weight': 'Weight',
      'stepForm.height': 'Height',
      'stepForm.experienceLevel': 'Experience Level',
      'stepForm.trainingFrequency': 'Training Frequency',
      'stepForm.mainSport': 'Main Sport',
      'stepForm.objective': 'Main Objective',
      'stepForm.medicalConditions': 'Medical Conditions',
      'stepForm.medicalConditionsHelp':
        'Separated by commas (e.g., Hypertension, Diabetes)',
      'stepForm.allergies': 'Allergies',
      'stepForm.allergiesHelp': 'Separated by commas (e.g., Lactose, Nuts)',
      'stepForm.currentSupplements': 'Current Supplements',
      'stepForm.currentSupplementsHelp':
        'Separated by commas (e.g., Whey Protein, Creatine)',
      'stepForm.backButton': '← Back',
      'stepForm.nextButton': 'Next →',
      'stepForm.updateButton': 'Update Profile',
      'stepForm.completeButton': 'Complete',
      'gender.male': 'Male',
      'gender.female': 'Female',
      'gender.other': 'Other',
      'experience.beginner': 'Beginner',
      'experience.intermediate': 'Intermediate',
      'experience.advanced': 'Advanced',
      'frequency.low': 'Low (1-2 times/week)',
      'frequency.medium': 'Medium (3-4 times/week)',
      'frequency.high': 'High (5+ times/week)',
      'stepForm.selectPlaceholder': 'Select...',
      'sports.futbol': 'Football',
      'sports.baloncesto': 'Basketball',
      'sports.tenis': 'Tennis',
      'sports.natacion': 'Swimming',
      'sports.ciclismo': 'Cycling',
      'sports.running': 'Running',
      'sports.gimnasio': 'Fitness',
      'sports.crossfit': 'Crossfit',
      'sports.yoga': 'Yoga',
      'sports.pilates': 'Pilates',
      'sports.boxeo': 'Boxing',
      'sports.mma': 'MMA',
      'sports.atletismo': 'Athletics',
      'sports.voleibol': 'Volleyball',
      'sports.hockey': 'Hockey',
      'sports.rugby': 'Rugby',
      'sports.golf': 'Golf',
      'sports.padel': 'Padel',
      'sports.squash': 'Squash',
      'sports.badminton': 'Badminton',
      'sports.esqui': 'Skiing',
      'sports.snowboard': 'Snowboarding',
      'sports.surf': 'Surfing',
      'sports.escalada': 'Climbing',
      'sports.triatlon': 'Triathlon',
      'sports.maraton': 'Marathon',
      'sports.ultra_trail': 'Ultra Trail',
      'sports.powerlifting': 'Powerlifting',
      'sports.bodybuilding': 'Fitness',
      'sports.calistenia': 'Calisthenics',
      'sports.danza': 'Dance',
      'sports.artes_marciales': 'Martial Arts',
      'sports.otro': 'Other',
      'stepForm.objectivePlaceholder': 'e.g., Gain muscle mass, lose weight',
      'stepForm.medicalConditionsPlaceholder': 'e.g., Asthma, Diabetes',
      'stepForm.allergiesPlaceholder': 'e.g., Lactose, Gluten',
      'stepForm.currentSupplementsPlaceholder': 'e.g., Whey Protein, Creatine',
      'stepForm.error.objective':
        'Please complete the required field: Main Objective',
      'stepForm.error.age.range':
        'Please enter a valid age (between 14 and 99 years).',
      'stepForm.error.weight.range':
        'Please enter a valid weight (between 30 and 300 kg).',
      'stepForm.error.height.range':
        'Please enter a valid height (between 100 and 250 cm).',
      'stepForm.error.missingFields':
        'Please complete the following required fields: {{fields}}',
      'profileSummary.title': 'Profile Summary',
      'profileSummary.age': 'Age',
      'profileSummary.gender': 'Gender',
      'profileSummary.weight': 'Weight',
      'profileSummary.height': 'Height',
      'profileSummary.objective': 'Objective',
      'profileSummary.experience': 'Experience',
      'profileSummary.trainingFrequency': 'Training Frequency',
      'profileSummary.mainSport': 'Main Sport',
      'profileSummary.medicalConditions': 'Medical Conditions',
      'profileSummary.allergies': 'Allergies',
      'profileSummary.currentSupplements': 'Current Supplements',
      'profileSummary.none': 'None',
      'profileSummary.generateButton': 'Generate Report',
      'profileSummary.generatingButton': 'Generating Report...',
      'Rendimiento Cognitivo': 'Cognitive Performance',
      'Salud y Bienestar': 'Health & Wellness',
      'Quema de Grasa': 'Fat Burning',
      'Rendimiento Deportivo': 'Sports Performance',
      userDropdown: {
        viewProfile: 'View profile',
        logout: 'Log out',
      },
      profile: {
        age: 'Age',
        gender: 'Gender',
        weight: 'Weight',
        height: 'Height',
        objective: 'Objective',
        experience: 'Experience',
        trainingFrequency: 'Training Frequency',
        mainSport: 'Main Sport',
        medicalConditions: 'Medical Conditions',
        allergies: 'Allergies',
        currentSupplements: 'Current Supplements',
        none: 'None',
        gender_male: 'Male',
        gender_female: 'Female',
        gender_other: 'Other',
        exp_beginner: 'Beginner',
        exp_intermediate: 'Intermediate',
        exp_advanced: 'Advanced',
        freq_low: 'Low (1-2 times/week)',
        freq_medium: 'Medium (3-4 times/week)',
        freq_high: 'High (5+ times/week)',
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdate: 'Last updated: {{date}}',
        section1: {
          title: '1. Information We Collect',
          subtitle1: 'Information You Provide',
          item1:
            'When you register, we collect your name, email, and password.',
          item2:
            'When using the customizer, we collect data about your goals, experience, gender, age, weight, height, allergies, and medical conditions.',
          item3:
            'Any other information you voluntarily provide through forms or direct communication.',
          subtitle2: 'Information Collected Automatically',
          item4:
            'Usage data: How you interact with our application, which features you use, and how often.',
          item5:
            'Device information: Device type, operating system, unique device identifiers.',
          item6:
            'Cookies and similar technologies to enhance your experience and analyze application usage.',
        },
        section2: {
          title: '2. How We Use Your Information',
          items: [
            '• Generate personalized supplement recommendations.',
            '• Improve our algorithms and services.',
            '• Provide customer support.',
            '• Send important service updates.',
            '• Comply with legal obligations.',
          ],
        },
        section3: {
          title: '3. Information Sharing',
          text: '<strong>We do not sell, rent, or share your personal information</strong> with third parties, except in the following cases:',
          items: [
            '• With your explicit consent.',
            '• To comply with legal obligations.',
            '• With service providers who help us operate the platform (under strict confidentiality agreements).',
            '• In a medical emergency (relevant information only).',
          ],
        },
        section4: {
          title: '4. Data Security',
          text: 'We implement technical and organizational security measures to protect your information:',
          items: [
            '• Data encryption in transit and at rest.',
            '• Restricted access to personal information.',
            '• Regular security monitoring.',
            '• Secure backups.',
          ],
        },
        section5: {
          title: '5. Your Rights',
          items: [
            '• <strong>Access:</strong> You can request a copy of your personal data.',
            '• <strong>Rectification:</strong> You can correct inaccurate information.',
            '• <strong>Deletion:</strong> You can request the deletion of your data.',
            '• <strong>Portability:</strong> You can request the transfer of your data.',
            '• <strong>Objection:</strong> You can object to the processing of your data.',
          ],
        },
        section6: {
          title: '6. Data Retention',
          text: 'We retain your personal information only for as long as necessary to fulfill the purposes described in this policy, or as required by law. Data is securely deleted when it is no longer needed.',
        },
        section7: {
          title: '7. Cookies and Similar Technologies',
          text: 'We use cookies and similar technologies to improve your experience, analyze application usage, and personalize content. You can control the use of cookies through your browser settings.',
        },
        section8: {
          title: '8. Minors',
          text: 'Our service is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with information, please contact us immediately.',
        },
        section9: {
          title: '9. Changes to this Policy',
          text: 'We may update this privacy policy from time to time. We will notify you of significant changes via email or through the application. We recommend reviewing this policy periodically.',
        },
        section10: {
          title: '10. Contact Us',
          text: 'If you have questions about this privacy policy or how we handle your data, you can contact us at:',
        },
        commitment: {
          title: 'Compromiso con tu Privacidad',
          text: 'En EGN Fitness, tu privacidad es fundamental. Nos comprometemos a proteger tu información personal y a ser transparentes sobre cómo la utilizamos. Si tienes alguna preocupación, no dudes en contactarnos.',
        },
      },
      loginRequired: {
        title: 'Restricted Access',
        message: 'You must log in to access <1>{{section}}</1>.',
        subtext:
          'This section contains personalized content that requires authentication.',
        loginButton: 'Log In',
        whyTitle: 'Why do I need to log in?',
        whyText:
          'To access personalized content, save your reports, and get recommendations specific to you.',
      },
      sections: {
        personalización: 'Personalization',
        informes: 'Reports',
        perfil: 'Profile',
      },
      'deportes.fitness.title': 'Fitness',
      'deportes.fitness.content':
        'Creatine: Improves strength and power. BCAAs: Reduces muscle fatigue. Beta-Alanine: Increases endurance during short and intense efforts.',
      'sports.fitness': 'Fitness',
      'profileSummary.years': 'años',
      'profileSummary.kg': 'kg',
      'cognitivo.memoria.title': 'Memory and Learning',
      'cognitivo.memoria.content':
        '- **Bacopa Monnieri:** Improves working memory and information retention.\n- **Ginkgo Biloba:** Enhances mental agility and cerebral circulation.\n- **Phosphatidylserine:** Essential for cognitive function and learning.\n- Strong memory is key for academic, professional, and athletic success.',
      'cognitivo.energia.title': 'Mental Energy and Focus',
      'cognitivo.energia.content':
        '- **L-Theanine + Caffeine:** Boost mental energy and sustained concentration.\n- **Rhodiola Rosea:** Reduces fatigue and improves stress resilience.\n- High brain energy levels enhance productivity and well-being.',
      'cognitivo.suplementosClave.title':
        'Key Supplements for Cognitive Performance',
      'cognitivo.areasMejora.title': 'Cognitive Improvement Areas',
      'mujer.osea.title': 'Bone Health & Menopause',
      'mujer.osea.content':
        'Calcium: Essential for bone density and osteoporosis prevention, especially after menopause. Vitamin D: Key for calcium absorption and bone health. Magnesium: Maintains strong bones and reduces cramps. Vitamin K2: Supports bone mineralization and prevents arterial calcification. Collagen: Supports bone and joint structure. Resistance exercise: Key to maintaining bone mass in adult women.',
      'mujer.belleza.title': 'Natural Beauty & Skin Health',
      'mujer.belleza.content':
        'Collagen: Improves elasticity and firmness of skin, hair, and nails. Hyaluronic acid: Hydrates and protects the skin from within. Vitamin C: Powerful antioxidant that stimulates collagen synthesis and protects against aging. Omega-3: Reduces inflammation and promotes radiant skin. Probiotics: Contribute to microbiota balance and improve skin health. Sun protection and healthy habits: Essential for lasting beauty.',
      'grasa.metabolismo.title': 'Metabolismo Energético',
      'grasa.metabolismo.content':
        'El metabolismo energético es el conjunto de procesos que convierten los nutrientes en energía utilizable. L-Carnitina: Facilita el transporte de ácidos grasos a la mitocondria para su uso como energía. Magnesio: Esencial para más de 300 reacciones metabólicas, incluyendo la producción de energía. Omega-3: Mejora la sensibilidad a la insulina y favorece el metabolismo de las grasas. Vitamina D: Relacionada con una mejor composición corporal y metabolismo activo. Ejercicio regular: Aumenta el gasto calórico y la eficiencia metabólica.',
      'deportes.yoga.title': 'Yoga',
      'deportes.yoga.content':
        'Ashwagandha: Reduces stress and improves flexibility. Magnesium: Helps with muscle relaxation. Omega-3: Supports recovery and joint health.',
      'deportes.natacion.title': 'Swimming',
      'deportes.natacion.content':
        'Electrolytes: Maintain hydration during exercise. Protein: For muscle recovery. Magnesium: Prevents cramps and improves aquatic performance.',
      'grasa.stats.title': 'Fat Loss Statistics',
      'grasa.stats.termogenicos':
        'Thermogenics can increase calorie expenditure by 3-10%',
      'grasa.stats.apetito':
        '78% of people who control their appetite manage to maintain their target weight',
      'grasa.stats.fundamentos':
        'Combining diet, exercise, and supplements increases fat loss by 35%',
      'mujer.integral.title': "Comprehensive Women's Health",
      'mujer.osea-belleza.title': 'Bone Health & Beauty',
    },
  },
  es: {
    translation: {
      'nav.home': 'Inicio',
      'nav.custom': 'Personalizar',
      'nav.reports': 'Informes',
      'nav.categories': 'Categorías',
      'search.placeholder': 'Buscar...',
      'home.welcome': 'Bienvenido a EGN',
      'home.description':
        'EGN es tu asesor inteligente de suplementación deportiva. Personaliza tu perfil, genera informes profesionales y resuelve tus dudas con nuestra IA experta. ¡Optimiza tu rendimiento y salud con recomendaciones basadas en tu perfil y objetivos!',
      'home.cta.ready': '¿Listo para empezar?',
      'home.cta.goTo': 'Ve a la sección',
      'home.cta.personalize': 'Personalización',
      'home.cta.getRecommendations':
        'para crear tu perfil y obtener recomendaciones personalizadas.',
      'home.cta.button': 'Comenzar ahora',
      'deportes.title': 'Rendimiento por Deporte',
      'deportes.description':
        'Cada disciplina tiene sus propias demandas. Descubre qué suplementos son los más efectivos para tu deporte, ya sea que busques fuerza, resistencia o una recuperación más rápida.',
      'deportes.card.suplementos': 'Suplementos Clave',
      'deportes.stats.title': 'Estadísticas del Deporte',
      'deportes.stats.fitness':
        'El 67% de los practicantes de fitness reportan mejoras significativas en fuerza con suplementación adecuada',
      'deportes.stats.crossfit':
        'Los atletas de CrossFit que usan suplementos específicos mejoran su rendimiento en un 23%',
      'deportes.stats.resistencia':
        'El 89% de corredores de maratón utilizan suplementos para optimizar su rendimiento',
      'deportes.stats.equipo':
        'Los deportistas de equipo que suplementan correctamente reducen su tiempo de recuperación en un 40%',
      'salud.title': 'Salud y Bienestar',
      'salud.description':
        'Una base sólida de salud es esencial para cualquier objetivo de fitness. Aquí encontrarás suplementos que apoyan tu bienestar general, desde vitaminas hasta antioxidantes.',
      'salud.card.puntosClave': 'Puntos Clave',
      'salud.stats.title': 'Datos de Salud Global',
      'salud.stats.vitaminas':
        'El 42% de la población mundial tiene deficiencia de vitamina D',
      'salud.stats.minerales':
        'El 75% de las personas no consume suficiente magnesio diariamente',
      'salud.stats.omega3':
        'Solo el 10% de la población consume la cantidad recomendada de Omega-3',
      'grasa.title': 'Quema de Grasa Inteligente',
      'grasa.description':
        'Descubre los suplementos y estrategias más efectivos para optimizar la pérdida de grasa de forma saludable y sostenible.',
      'grasa.card.suplementos': 'Suplementos Clave',
      'grasa.l-carnitina.title': 'L-Carnitina',
      'grasa.l-carnitina.content':
        'Facilita el transporte de ácidos grasos a la mitocondria para la producción de energía. Especialmente útil en entrenamientos de resistencia y fases de pérdida de grasa.',
      'grasa.cla.title': 'CLA (Ácido Linoleico Conjugado)',
      'grasa.cla.content':
        'Ayuda a reducir la grasa corporal y mantener la masa muscular durante la pérdida de peso. Su efecto es mayor si se combina con ejercicio y una dieta saludable.',
      'grasa.te-verde.title': 'Extracto de Té Verde',
      'grasa.te-verde.content':
        'Rico en catequinas y cafeína, aumenta el metabolismo y la oxidación de grasas. Además, aporta beneficios antioxidantes.',
      'grasa.cafeina.title': 'Cafeína',
      'grasa.cafeina.content':
        'Estimula el metabolismo, incrementa el gasto energético y mejora el rendimiento durante el ejercicio. Ayuda a movilizar la grasa para su uso como energía.',
      'grasa.puntos-clave': 'Puntos Clave',
      'mujer.title': "Women's Health & Wellness",
      'mujer.description':
        'Women have unique nutritional and physiological needs. This section focuses on key supplements to support hormonal, bone, and overall female wellness.',
      'mujer.stats.title': "Women's Health in Numbers",
      'mujer.stats.fundamentos':
        '85% of women do not consume enough calcium to prevent osteoporosis',
      'mujer.stats.equilibrio':
        '70% of women experience hormonal imbalances at some point in their lives',
      'mujer.stats.escucha':
        '60% of women who listen to their bodies improve their overall well-being',
      'cognitivo.title': 'Rendimiento Cognitivo',
      'cognitivo.description':
        'Tu cerebro es tu activo más importante. Descubre cómo la suplementación puede potenciar tu enfoque, memoria y resistencia al estrés para un máximo rendimiento mental.',
      'cognitivo.stats.title': 'Datos del Cerebro',
      'cognitivo.stats.nootropicos':
        'Los nootrópicos pueden mejorar la memoria de trabajo en un 15-25%',
      'cognitivo.stats.adaptogenos':
        'El 80% de las personas que usan adaptógenos reportan mejor manejo del estrés',
      'cognitivo.stats.salud':
        'La suplementación cerebral puede reducir el deterioro cognitivo en un 30%',
      'cognitivo.stats.estrategias':
        'Las estrategias de optimización cognitiva mejoran la productividad en un 40%',
      'footer.nav.title': 'Navegación',
      'footer.nav.home': 'Inicio',
      'footer.nav.deportes': 'Deportes',
      'footer.nav.salud': 'Salud y Bienestar',
      'footer.nav.grasa': 'Quema de Grasa',
      'footer.nav.mujer': 'Específico Mujer',
      'footer.nav.cognitivo': 'Rendimiento Cognitivo',
      'footer.services.title': 'Servicios',
      'footer.services.custom': 'Personalización',
      'footer.services.reports': 'Mis Informes',
      'footer.services.faq': 'Preguntas Frecuentes',
      'footer.contact.title': 'Contacto',
      'footer.contact.form': 'Formulario de Contacto',
      'footer.contact.location': 'Granada, España',
      'footer.tagline': 'Tu compañero de fitness inteligente',
      'footer.copyright': 'Todos los derechos reservados',
      'footer.legal.terms': 'Términos de Servicio',
      'footer.legal.privacy': 'Política de Privacidad',
      'megaMenu.conocenos': 'Conócenos',
      'megaMenu.deportes': 'Deportes',
      'megaMenu.salud': 'Salud',
      'megaMenu.grasa': 'Quema Grasa',
      'megaMenu.mujer': 'Específico Mujer',
      'megaMenu.cognitivo': 'Rendimiento Cognitivo',
      'salud.vitaminas.title': 'Vitaminas Esenciales',
      'salud.minerales.title': 'Minerales Clave',
      'salud.antioxidantes.title': 'Antioxidantes y Omega-3',
      'deportes.pesas.title': 'Fitness',
      'deportes.crossfit.title': 'Crossfit / HIIT',
      'deportes.resistencia.title':
        'Ciclismo / Running / Deportes de Resistencia',
      'deportes.equipo.title': 'Deportes de Equipo',
      'grasa.termogenicos.title': 'Termogénicos y Metabolismo',
      'grasa.metabolismo-energetico.title': 'Metabolismo Energético',
      'grasa.metabolismo-energetico.content':
        'L-Carnitina: Facilita el transporte de ácidos grasos a la mitocondria para su uso como energía. Magnesio: Esencial para más de 300 reacciones metabólicas, incluyendo la producción de energía. Omega-3: Mejora la sensibilidad a la insulina y favorece el metabolismo de las grasas. Vitamina D: Relacionada con una mejor composición corporal y metabolismo activo. Ejercicio regular: Aumenta el gasto calórico y la eficiencia metabólica.',
      'grasa.apetito.title': 'Control del Apetito',
      'grasa.fundamentos.title': 'Fundamentos de la Quema de Grasa',
      'mujer.fundamentos.title': 'Fundamentos para la Mujer',
      'mujer.equilibrio.title': 'Equilibrio Hormonal y Piel',
      'mujer.escucha.title': 'Escucha a tu Cuerpo',
      'cognitivo.nootropicos.title': 'Nootrópicos: Potencia tu Enfoque',
      'cognitivo.adaptogenos.title': 'Adaptógenos y Estrés',
      'cognitivo.salud.title': 'Salud Cerebral a Largo Plazo',
      'cognitivo.estrategias.title': 'Estrategias de Optimización Cognitiva',
      'bottomNav.profile': 'Perfil',
      'salud.vitaminas.content':
        'Vitamina D: Para la salud ósea e inmunidad. Vitaminas del grupo B: Esenciales para la energía y el metabolismo. Vitamina C: Potente antioxidante. Vitamina A: Para la salud visual y de la piel. Vitamina E: Protege las células del daño oxidativo. Vitamina K: Esencial para la coagulación sanguínea y la salud ósea.',
      'salud.minerales.content':
        'Magnesio: Para la recuperación muscular y el sueño. Zinc: Clave para la testosterona y la inmunidad. Hierro: Esencial para el transporte de oxígeno, especialmente en mujeres. Calcio: Para la salud ósea y la contracción muscular. Selenio: Antioxidante y apoyo tiroideo. Potasio: Para el equilibrio electrolítico y la función muscular.',
      'salud.antioxidantes.content':
        'Omega-3: Reduce la inflamación y mejora la salud cardiovascular. Coenzima Q10: Vital para la energía celular. Cúrcuma: Potente antiinflamatorio. Resveratrol: Protege contra el envejecimiento celular. Astaxantina: Antioxidante más potente que la vitamina E. Glutatión: El antioxidante maestro del cuerpo.',
      'salud.proteina.title': 'Proteínas Esenciales',
      'salud.proteina.content':
        'Proteína Whey: Fundamental para la síntesis muscular y recuperación. Colágeno: Para la salud de articulaciones, piel y tejido conectivo. Proteína de Caseína: Liberación lenta para recuperación nocturna. Proteína de Huevo: Alta biodisponibilidad y perfil aminoacídico completo. Proteína Vegetal: Opción para dietas veganas y vegetarianas.',
      'salud.probioticos.title': 'Probióticos y Salud Digestiva',
      'salud.probioticos.content':
        'Lactobacillus: Para la salud digestiva y sistema inmune. Bifidobacterium: Mejora la absorción de nutrientes. Saccharomyces Boulardii: Protege contra infecciones digestivas. Prebióticos: Alimentan las bacterias beneficiosas del intestino. Enzimas Digestivas: Mejoran la digestión y absorción de nutrientes.',
      'deportes.pesas.content':
        'Creatine: Improves strength and power. BCAAs: Reduces muscle fatigue. Beta-Alanine: Increases endurance during short and intense efforts.',
      'deportes.crossfit.content':
        'HMB: Evita el catabolismo muscular durante entrenamientos intensos. Citrulina Malato: Mejora el flujo sanguíneo y reduce la fatiga. Taurina: Apoya la hidratación celular y el metabolismo. Cafeína: Mejora el rendimiento en ejercicios de alta intensidad. Beta-Alanine: Para la resistencia en WODs intensos. Electrolitos: Para mantener el equilibrio durante entrenamientos largos.',
      'deportes.resistencia.content':
        'Electrolitos: Para una correcta hidratación y prevención de calambres. Beta-Alanine: Ayuda a retrasar la fatiga muscular en esfuerzos prolongados. Cafeína: Mejora el enfoque y reduce la percepción de esfuerzo. Nitratos: Mejoran la eficiencia en el uso del oxígeno. BCAAs: Previenen la degradación muscular durante cardio largo. Omega-3: Reduce la inflamación post-entrenamiento.',
      'deportes.equipo.content':
        'Glutamina: Apoya la recuperación y el sistema inmune entre partidos. Arginina: Mejora el flujo sanguíneo y la entrega de nutrientes. Nitratos (de remolacha): Mejoran la eficiencia en el uso del oxígeno. Creatina: Para explosividad en sprints y saltos. BCAAs: Para recuperación entre sesiones de entrenamiento. Proteína: Fundamental para la reparación muscular post-competición.',
      'grasa.termogenicos.content':
        'Extracto de Té Verde: Aumenta el metabolismo en un 3-4%. Pimienta de Cayena: Incrementa la temperatura corporal y quema de calorías. Sinefrina: Estimulante que puede aumentar la quema de grasa. Cafeína: Acelera el metabolismo y mejora el rendimiento. L-Carnitina: Transporta ácidos grasos para ser usados como energía. CLA: Puede reducir la grasa corporal y preservar masa muscular.',
      'grasa.apetito.content':
        'Glucomanano: Fibra soluble que promueve la saciedad. Garcinia Cambogia: Puede bloquear la producción de grasa. 5-HTP: Ayuda a regular el apetito y el estado de ánimo.',
      'grasa.fundamentos.content':
        'L-Carnitina: Ayuda a transportar los ácidos grasos para ser usados como energía. CLA (Ácido Linoleico Conjugado): Puede reducir la grasa corporal. Extracto de Té Verde: Contiene catequinas que ayudan a acelerar el metabolismo y aumentar la oxidación de grasas.',
      'mujer.fundamentos.content':
        'Ácido fólico: Esencial para la salud celular. Calcio: Clave para la salud ósea, especialmente tras la menopausia. Hierro: Para prevenir la anemia, común en mujeres.',
      'mujer.equilibrio.content':
        'DIM (Diindolilmetano): Ayuda a equilibrar los estrógenos. Vitex Agnus-Castus: Puede regular los ciclos menstruales. Colágeno: Para la salud de la piel, cabello y uñas.',
      'mujer.escucha.content':
        'Aceite de onagra: Puede aliviar síntomas premenstruales. Probióticos: Para la salud digestiva y vaginal. Ashwagandha: Adaptógeno para manejar el estrés.',
      'cognitivo.nootropicos.content':
        'L-Teanina y Cafeína: Combinación sinérgica para un enfoque calmado y sin nerviosismo. Bacopa Monnieri: Hierba adaptogénica que mejora la memoria y reduce la ansiedad con uso continuado. Ginkgo Biloba: Conocido por mejorar la circulación y función cognitiva.',
      'cognitivo.adaptogenos.content':
        'Rhodiola Rosea: Combate la fatiga mental y física. Panax Ginseng: Mejora la memoria y el estado de ánimo. Cordyceps: Puede aumentar la energía y utilización del oxígeno.',
      'cognitivo.salud.content':
        'Fosfatidilserina: Clave para la función cognitiva. Melena de León: Hongo que puede estimular el crecimiento nervioso. DHA (Omega-3): Esencial para la estructura cerebral.',
      'cognitivo.estrategias.content':
        'Ayuno Intermitente: Puede mejorar la claridad mental. Sueño de Calidad: Esencial para la consolidación de la memoria. Meditación: Reduce el estrés y mejora el enfoque.',
      'faq.title': 'Preguntas Frecuentes',
      'faq.subtitle':
        'Encuentra respuestas a las preguntas más comunes sobre EGN Fitness',
      'faq.q1': '¿Qué es EGN Fitness?',
      'faq.a1':
        'EGN (Endless Goals Nutrition) es tu asesor inteligente de suplementación deportiva. Utilizamos IA avanzada para crear recomendaciones personalizadas basadas en tu perfil, objetivos y necesidades específicas.',
      'faq.q2': '¿Cómo funciona la personalización?',
      'faq.a2':
        'Completas un formulario detallado con tu información personal, deporte, experiencia, objetivos y condiciones médicas. Nuestra IA analiza estos datos para generar recomendaciones específicas para ti.',
      'faq.q3': '¿Son seguras las recomendaciones?',
      'faq.a3':
        'Nuestras recomendaciones son sugerencias generales basadas en evidencia científica. Siempre recomendamos consultar con un profesional de la salud antes de comenzar cualquier suplementación, especialmente si tienes condiciones médicas.',
      'faq.q4': '¿Qué deportes cubre la aplicación?',
      'faq.a4':
        'Cubrimos una amplia gama de deportes: desde levantamiento de pesas y culturismo hasta deportes de resistencia como running y ciclismo, team sports, CrossFit, yoga y muchos más.',
      'faq.q5': '¿Puedo usar la app si soy principiante?',
      'faq.a5':
        '¡Absolutamente! Nuestras recomendaciones se adaptan a todos los niveles, desde principiantes hasta atletas avanzados. La suplementación se ajusta según tu experiencia y objetivos.',
      'faq.q6': '¿Cómo se generan los informes?',
      'faq.a6':
        'Utilizamos inteligencia artificial avanzada para analizar tu perfil y generar informes detallados que incluyen recomendaciones específicas, dosis sugeridas y momentos óptimos para tomar cada suplemento.',
      'faq.q7': '¿Los suplementos recomendados son legales?',
      'faq.a7':
        'Solo recomendamos suplementos legales y aprobados. Nuestras recomendaciones se basan en productos disponibles en el mercado que cumplen con las regulaciones de seguridad.',
      'faq.q8': '¿Puedo modificar mi perfil después?',
      'faq.a8':
        "Sí, puedes editar tu perfil en cualquier momento desde la sección 'Mi Perfil'. Los cambios se reflejarán en futuras recomendaciones.",
      'faq.q9': '¿Qué pasa si tengo alergias o condiciones médicas?',
      'faq.a9':
        'Es crucial que incluyas esta información en tu perfil. Nuestra IA considerará estas limitaciones para evitar recomendaciones que puedan ser perjudiciales para tu salud.',
      'faq.q10': '¿Cómo contacto con soporte?',
      'faq.a10':
        'Puedes contactarnos por email en endlessgoalsnutrition@gmail.com o seguirnos en nuestras redes sociales para obtener las últimas actualizaciones y consejos.',
      'faq.notFoundTitle': '¿No encuentras tu respuesta?',
      'faq.notFoundText':
        'Nuestro equipo está aquí para ayudarte. No dudes en contactarnos.',
      'faq.contactButton': 'Ir al Formulario de Contacto',
      'terms.title': 'Términos de Servicio',
      'terms.lastUpdate': 'Última actualización: {{date}}',
      'terms.section1.title': '1. Aceptación de los Términos',
      'terms.section1.text':
        'Al acceder y utilizar EGN Fitness (Endless Goals Nutrition), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.',
      'terms.section2.title': '2. Descripción del Servicio',
      'terms.section2.text':
        'EGN Fitness es una plataforma de asesoramiento en suplementación deportiva que utiliza inteligencia artificial para proporcionar recomendaciones personalizadas basadas en tu perfil y objetivos.',
      'terms.section2.important':
        'Nuestras recomendaciones son informativas y no sustituyen el consejo médico profesional. Siempre consulta con un profesional de la salud antes de comenzar cualquier suplementación.',
      'terms.section3.title': '3. Uso Responsable',
      'terms.section3.item1':
        '• Debes proporcionar información precisa y actualizada en tu perfil',
      'terms.section3.item2':
        '• No debes usar el servicio si tienes menos de 18 años sin supervisión parental',
      'terms.section3.item3':
        '• Eres responsable de consultar con profesionales de la salud antes de seguir nuestras recomendaciones',
      'terms.section3.item4':
        '• No debes usar el servicio para fines ilegales o no autorizados',
      'terms.section4.title': '4. Limitaciones de Responsabilidad',
      'terms.section4.text': 'EGN Fitness no se hace responsable de:',
      'terms.section4.item1':
        '• Cualquier efecto adverso derivado del uso de suplementos recomendados',
      'terms.section4.item2':
        '• Interacciones con medicamentos o condiciones médicas existentes',
      'terms.section4.item3': '• Resultados específicos de rendimiento o salud',
      'terms.section4.item4':
        '• Interrupciones del servicio o pérdida de datos',
      'terms.section5.title': '5. Privacidad y Datos',
      'terms.section5.text':
        'Tu privacidad es importante para nosotros. Recopilamos y procesamos datos personales únicamente para proporcionar nuestros servicios. Consulta nuestra Política de Privacidad para más detalles sobre cómo manejamos tu información.',
      'terms.section6.title': '6. Propiedad Intelectual',
      'terms.section6.text':
        'Todo el contenido, algoritmos y tecnología de EGN Fitness están protegidos por derechos de autor y otras leyes de propiedad intelectual. No está permitido copiar, distribuir o modificar nuestro contenido sin autorización.',
      'terms.section7.title': '7. Modificaciones',
      'terms.section7.text':
        'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación. Te recomendamos revisar estos términos periódicamente.',
      'terms.section8.title': '8. Contacto',
      'terms.section8.text':
        'Si tienes preguntas sobre estos términos, puedes contactarnos en: Email: endlessgoalsnutrition@gmail.com',
      'terms.legalNoticeTitle': 'Aviso Legal Importante',
      'terms.legalNoticeText':
        'Las recomendaciones proporcionadas por EGN Fitness son únicamente informativas y educativas. No constituyen consejo médico, diagnóstico o tratamiento. Siempre consulta con un profesional de la salud calificado antes de comenzar cualquier programa de suplementación.',
      'privacy.title': 'Política de Privacidad',
      'privacy.lastUpdate': 'Última actualización: {{date}}',
      'privacy.section1.title': '1. Información que Recopilamos',
      'privacy.section2.title': '2. Cómo Utilizamos tu Información',
      'privacy.section2.text':
        '• Generar recomendaciones personalizadas de suplementación • Mejorar nuestros algoritmos y servicios • Proporcionar soporte al cliente • Enviar actualizaciones importantes sobre el servicio • Cumplir con obligaciones legales',
      'privacy.section3.title': '3. Compartir Información',
      'privacy.section3.strong':
        'No vendemos, alquilamos ni compartimos tu información personal',
      'privacy.section3.text': 'con terceros, excepto en los siguientes casos:',
      'privacy.section3.case1': '• Con tu consentimiento explícito',
      'privacy.section3.case2': '• Para cumplir con obligaciones legales',
      'privacy.section3.case3':
        '• Con proveedores de servicios que nos ayudan a operar la plataforma (bajo estrictos acuerdos de confidencialidad)',
      'privacy.section3.case4':
        '• En caso de emergencia médica (solo información relevante)',
      'privacy.section4.title': '4. Seguridad de Datos',
      'privacy.section4.text':
        'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:',
      'privacy.section4.case1':
        '• Encriptación de datos en tránsito y en reposo',
      'privacy.section4.case2': '• Acceso restringido a información personal',
      'privacy.section4.case3': '• Monitoreo regular de seguridad',
      'privacy.section4.case4': '• Copias de seguridad seguras',
      'privacy.section5.title': '5. Tus Derechos',
      'privacy.section5.case1':
        '• Acceso: Puedes solicitar una copia de tus datos personales',
      'privacy.section5.case2':
        '• Rectificación: Puedes corregir información inexacta',
      'privacy.section5.case3':
        '• Eliminación: Puedes solicitar la eliminación de tus datos',
      'privacy.section5.case4':
        '• Portabilidad: Puedes solicitar la transferencia de tus datos',
      'privacy.section5.case5':
        '• Oposición: Puedes oponerte al procesamiento de tus datos',
      'privacy.section6.title': '6. Retención de Datos',
      'privacy.section6.text':
        'Conservamos tu información personal únicamente durante el tiempo necesario para cumplir con los propósitos descritos en esta política, o según lo requiera la ley. Los datos se eliminan de forma segura cuando ya no son necesarios.',
      'privacy.section7.title': '7. Cookies y Tecnologías Similares',
      'privacy.section7.text':
        'Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu navegador.',
      'privacy.section8.title': '8. Menores de Edad',
      'privacy.section8.text':
        'Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información, contáctanos inmediatamente.',
      'privacy.section9.title': '9. Cambios en esta Política',
      'privacy.section9.text':
        'Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos por email o a través de la aplicación. Te recomendamos revisar esta política periódicamente.',
      'privacy.section10.title': '10. Contacto',
      'privacy.section10.text':
        'Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, puedes contactarnos en:',
      'privacy.compromiso': 'Compromiso con tu Privacidad',
      'privacy.compromisoText':
        'En EGN Fitness, tu privacidad es fundamental. Nos comprometemos a proteger tu información personal y a ser transparentes sobre cómo la utilizamos. Si tienes alguna preocupación, no dudes en contactarnos.',
      'report.title': 'Informe personalizado',
      'report.copy': 'Copiar',
      'report.copied': '¡Copiado!',
      'report.generatingPDF': 'Generando PDF...',
      'report.downloadPDF': 'Descargar PDF',
      'report.delete': 'Eliminar informe',
      'report.linksTitle': 'Enlaces a productos recomendados:',
      'stepForm.personalInfo': 'Información Personal',
      'stepForm.bodyMeasures': 'Medidas Corporales',
      'stepForm.sportExperience': 'Experiencia Deportiva',
      'stepForm.healthGoals': 'Salud y Objetivos',
      'stepForm.errorX': 'Por favor, revisa los campos requeridos.',
      'userDrawer.title': 'Mi cuenta',
      'userDrawer.guest': 'Invitado',
      'userDrawer.login': 'Iniciar sesión',
      'userDrawer.register': 'Registro',
      'userDrawer.profile': 'Ver perfil',
      'userDrawer.logout': 'Cerrar sesión',
      'privacy.section1.subtitle1': 'Información Personal',
      'privacy.section1.item1':
        '• Datos de perfil: edad, género, peso, altura, deporte, experiencia',
      'privacy.section1.item2':
        '• Información de contacto: email (para autenticación)',
      'privacy.section1.item3':
        '• Información médica: condiciones médicas, alergias, suplementos actuales',
      'privacy.section1.subtitle2': 'Información de Uso',
      'privacy.section1.item4': '• Historial de informes generados',
      'privacy.section1.item5': '• Preferencias de la aplicación',
      'privacy.section1.item6': '• Datos de navegación y uso de la plataforma',
      'stepForm.age': 'Edad',
      'stepForm.gender': 'Género',
      'stepForm.weight': 'Peso',
      'stepForm.height': 'Altura',
      'stepForm.experienceLevel': 'Nivel de experiencia',
      'stepForm.trainingFrequency': 'Frecuencia de entrenamiento',
      'stepForm.mainSport': 'Deporte principal',
      'stepForm.objective': 'Objetivo principal',
      'stepForm.medicalConditions': 'Condiciones médicas',
      'stepForm.medicalConditionsHelp':
        'Separadas por comas (ej: Hipertensión, Diabetes)',
      'stepForm.allergies': 'Alergias',
      'stepForm.allergiesHelp':
        'Separadas por comas (ej: Lactosa, Frutos secos)',
      'stepForm.currentSupplements': 'Suplementos actuales',
      'stepForm.currentSupplementsHelp':
        'Separados por comas (ej: Proteína Whey, Creatine)',
      'stepForm.backButton': '← Anterior',
      'stepForm.nextButton': 'Siguiente →',
      'stepForm.updateButton': 'Actualizar perfil',
      'stepForm.completeButton': 'Finalizar',
      'gender.male': 'Masculino',
      'gender.female': 'Femenino',
      'gender.other': 'Otro',
      'experience.beginner': 'Principiante',
      'experience.intermediate': 'Intermedio',
      'experience.advanced': 'Avanzado',
      'frequency.low': 'Baja (1-2 veces/semana)',
      'frequency.medium': 'Media (3-4 veces/semana)',
      'frequency.high': 'Alta (5+ veces/semana)',
      'stepForm.selectPlaceholder': 'Selecciona...',
      'sports.futbol': 'Fútbol',
      'sports.baloncesto': 'Baloncesto',
      'sports.tenis': 'Tenis',
      'sports.natacion': 'Natación',
      'sports.ciclismo': 'Ciclismo',
      'sports.running': 'Running',
      'sports.gimnasio': 'Fitness',
      'sports.crossfit': 'Crossfit',
      'sports.yoga': 'Yoga',
      'sports.pilates': 'Pilates',
      'sports.boxeo': 'Boxeo',
      'sports.mma': 'MMA',
      'sports.atletismo': 'Atletismo',
      'sports.voleibol': 'Voleibol',
      'sports.hockey': 'Hockey',
      'sports.rugby': 'Rugby',
      'sports.golf': 'Golf',
      'sports.padel': 'Pádel',
      'sports.squash': 'Squash',
      'sports.badminton': 'Bádminton',
      'sports.esqui': 'Esquí',
      'sports.snowboard': 'Snowboard',
      'sports.surf': 'Surf',
      'sports.escalada': 'Escalada',
      'sports.triatlon': 'Triatlón',
      'sports.maraton': 'Maratón',
      'sports.ultra_trail': 'Ultra Trail',
      'sports.powerlifting': 'Powerlifting',
      'sports.bodybuilding': 'Fitness',
      'sports.calistenia': 'Calistenia',
      'sports.danza': 'Danza',
      'sports.artes_marciales': 'Artes Marciales',
      'sports.otro': 'Otro',
      'stepForm.objectivePlaceholder': 'Ej: Ganar masa muscular, perder peso',
      'stepForm.medicalConditionsPlaceholder': 'Ej: Asma, Diabetes',
      'stepForm.allergiesPlaceholder': 'Ej: Lactosa, Gluten',
      'stepForm.currentSupplementsPlaceholder': 'Ej: Proteína, Creatina',
      'stepForm.error.objective':
        'Por favor, completa el campo obligatorio: Objetivo principal',
      'stepForm.error.age.range':
        'Por favor, introduce una edad válida (entre 14 y 99 años).',
      'stepForm.error.weight.range':
        'Por favor, introduce un peso válido (entre 30 y 300 kg).',
      'stepForm.error.height.range':
        'Por favor, introduce una altura válida (entre 100 y 250 cm).',
      'stepForm.error.missingFields':
        'Por favor, completa los siguientes campos obligatorios: {{fields}}',
      'profileSummary.title': 'Resumen de tu perfil',
      'profileSummary.age': 'Edad',
      'profileSummary.gender': 'Género',
      'profileSummary.weight': 'Peso',
      'profileSummary.height': 'Altura',
      'profileSummary.objective': 'Objetivo',
      'profileSummary.experience': 'Experiencia',
      'profileSummary.trainingFrequency': 'Frecuencia de entrenamiento',
      'profileSummary.mainSport': 'Deporte principal',
      'profileSummary.medicalConditions': 'Condiciones médicas',
      'profileSummary.allergies': 'Alergias',
      'profileSummary.currentSupplements': 'Suplementos actuales',
      'profileSummary.none': 'Ninguna',
      'profileSummary.generateButton': 'Generar informe',
      'profileSummary.generatingButton': 'Generando informe...',
      'Rendimiento Cognitivo': 'Rendimiento Cognitivo',
      'Salud y Bienestar': 'Salud y Bienestar',
      'Quema de Grasa': 'Quema de Grasa',
      'Rendimiento Deportivo': 'Rendimiento Deportivo',
      userDropdown: {
        viewProfile: 'Ver perfil',
        logout: 'Cerrar sesión',
      },
      profile: {
        age: 'Edad',
        gender: 'Género',
        weight: 'Peso',
        height: 'Altura',
        objective: 'Objetivo',
        experience: 'Experiencia',
        trainingFrequency: 'Frecuencia de entrenamiento',
        mainSport: 'Deporte principal',
        medicalConditions: 'Condiciones médicas',
        allergies: 'Alergias',
        currentSupplements: 'Suplementos actuales',
        none: 'Ninguna',
        gender_male: 'Masculino',
        gender_female: 'Femenino',
        gender_other: 'Otro',
        exp_beginner: 'Principiante',
        exp_intermediate: 'Intermedio',
        exp_advanced: 'Avanzado',
        freq_low: 'Baja (1-2 veces/semana)',
        freq_medium: 'Media (3-4 veces/semana)',
        freq_high: 'Alta (5+ veces/semana)',
      },
      privacy: {
        title: 'Política de Privacidad',
        lastUpdate: 'Última actualización: {{date}}',
        section1: {
          title: '1. Información que Recopilamos',
          subtitle1: 'Información Proporcionada por el Usuario',
          item1:
            'Al registrarte, recopilamos tu nombre, correo electrónico y contraseña.',
          item2:
            'Al usar el personalizador, recopilamos datos sobre tus objetivos, experiencia, género, edad, peso, altura, alergias y condiciones médicas.',
          item3:
            'Cualquier otra información que nos proporciones voluntariamente a través de formularios o comunicación directa.',
          subtitle2: 'Información Recopilada Automáticamente',
          item4:
            'Datos de uso: Cómo interactúas con nuestra aplicación, qué funciones utilizas y con qué frecuencia.',
          item5:
            'Información del dispositivo: Tipo de dispositivo, sistema operativo, identificadores únicos del dispositivo.',
          item6:
            'Cookies y tecnologías similares para mejorar tu experiencia y analizar el uso de la aplicación.',
        },
        section2: {
          title: '2. Cómo Utilizamos tu Información',
          items: [
            '• Generar recomendaciones personalizadas de suplementación.',
            '• Mejorar nuestros algoritmos y servicios.',
            '• Proporcionar soporte al cliente.',
            '• Enviar actualizaciones importantes sobre el servicio.',
            '• Cumplir con obligaciones legales.',
          ],
        },
        section3: {
          title: '3. Compartir Información',
          text: '<strong>No vendemos, alquilamos ni compartimos tu información personal</strong> con terceros, excepto en los siguientes casos:',
          items: [
            '• Con tu consentimiento explícito.',
            '• Para cumplir con obligaciones legales.',
            '• Con proveedores de servicios que nos ayudan a operar la plataforma (bajo estrictos acuerdos de confidencialidad).',
            '• En caso de emergencia médica (solo información relevante).',
          ],
        },
        section4: {
          title: '4. Seguridad de Datos',
          text: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:',
          items: [
            '• Encriptación de datos en tránsito y en reposo.',
            '• Acceso restringido a información personal.',
            '• Monitoreo regular de seguridad.',
            '• Copias de seguridad seguras.',
          ],
        },
        section5: {
          title: '5. Tus Derechos',
          items: [
            '• <strong>Acceso:</strong> Puedes solicitar una copia de tus datos personales.',
            '• <strong>Rectificación:</strong> Puedes corregir información inexacta.',
            '• <strong>Eliminación:</strong> Puedes solicitar la eliminación de tus datos.',
            '• <strong>Portabilidad:</strong> Puedes solicitar la transferencia de tus datos.',
            '• <strong>Oposición:</strong> Puedes oponerte al procesamiento de tus datos.',
          ],
        },
        section6: {
          title: '6. Retención de Datos',
          text: 'Conservamos tu información personal únicamente durante el tiempo necesario para cumplir con los propósitos descritos en esta política, o según lo requiera la ley. Los datos se eliminan de forma segura cuando ya no son necesarios.',
        },
        section7: {
          title: '7. Cookies y Tecnologías Similares',
          text: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la aplicación y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu navegador.',
        },
        section8: {
          title: '8. Menores de Edad',
          text: 'Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado información, contáctanos inmediatamente.',
        },
        section9: {
          title: '9. Cambios en esta Política',
          text: 'Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos por email o a través de la aplicación. Te recomendamos revisar esta política periódicamente.',
        },
        section10: {
          title: '10. Contacto',
          text: 'Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, puedes contactarnos en:',
        },
        commitment: {
          title: 'Compromiso con tu Privacidad',
          text: 'En EGN Fitness, tu privacidad es fundamental. Nos comprometemos a proteger tu información personal y a ser transparentes sobre cómo la utilizamos. Si tienes alguna preocupación, no dudes en contactarnos.',
        },
      },
      loginRequired: {
        title: 'Acceso Restringido',
        message: 'Debes iniciar sesión para acceder a <1>{{section}}</1>.',
        subtext:
          'Esta sección contiene contenido personalizado que requiere autenticación.',
        loginButton: 'Iniciar Sesión',
        whyTitle: '¿Por qué necesito iniciar sesión?',
        whyText:
          'Para acceder a contenido personalizado, guardar tus informes y obtener recomendaciones específicas para ti.',
      },
      sections: {
        personalización: 'Personalización',
        informes: 'Informes',
        perfil: 'Perfil',
      },
      'deportes.fitness.title': 'Fitness',
      'deportes.fitness.content':
        'Creatina: Mejora la fuerza y potencia en un 5-15%. BCAAs: Reduce la fatiga muscular y acelera la recuperación. Beta-Alanine: Aumenta la resistencia en esfuerzos cortos e intensos. Proteína Whey: Fundamental para la síntesis proteica muscular. Glutamina: Apoya la recuperación y el sistema inmune. ZMA: Combinación de zinc, magnesio y vitamina B6 para recuperación.',
      'sports.fitness': 'Fitness',
      'profileSummary.years': 'años',
      'profileSummary.kg': 'kg',
      'cognitivo.memoria.title': 'Memoria y Aprendizaje',
      'cognitivo.memoria.content':
        '- **Bacopa Monnieri:** Mejora la memoria de trabajo y la retención de información.\n- **Ginkgo Biloba:** Favorece la agilidad mental y la circulación cerebral.\n- **Fosfatidilserina:** Clave para la función cognitiva y el aprendizaje.\n- Una memoria sólida es esencial para el éxito académico, profesional y deportivo.',
      'cognitivo.energia.title': 'Energía Mental y Enfoque',
      'cognitivo.energia.content':
        '- **L-Teanina + Cafeína:** Aumentan la energía mental y la concentración sostenida.\n- **Rhodiola Rosea:** Reduce la fatiga y mejora la resistencia al estrés.\n- Mantener altos niveles de energía cerebral potencia la productividad y el bienestar.',
      'cognitivo.suplementosClave.title':
        'Suplementos Clave para el Rendimiento Cognitivo',
      'cognitivo.areasMejora.title': 'Áreas de Mejora Cognitiva',
      'mujer.osea.title': 'Salud Ósea y Menopausia',
      'mujer.osea.content':
        'Calcio: Fundamental para la densidad ósea y prevención de osteoporosis, especialmente tras la menopausia. Vitamina D: Esencial para la absorción de calcio y salud ósea. Magnesio: Ayuda a mantener huesos fuertes y reduce calambres. Vitamina K2: Contribuye a la mineralización ósea y previene la calcificación arterial. Colágeno: Apoya la estructura ósea y articular. Ejercicio de resistencia: Clave para mantener la masa ósea en la mujer adulta.',
      'mujer.belleza.title': 'Belleza Natural y Salud de la Piel',
      'mujer.belleza.content':
        'Collagen: Mejora la elasticidad y firmeza de la piel, cabello y uñas. Ácido hialurónico: Hidrata y protege la piel desde el interior. Vitamina C: Potente antioxidante que estimula la síntesis de colágeno y protege contra el envejecimiento. Omega-3: Reduce la inflamación y favorece una piel luminosa. Probióticos: Contribuyen al equilibrio de la microbiota y mejoran la salud cutánea. Protección solar y hábitos saludables: Indispensables para una belleza duradera.',
      'grasa.metabolismo.title': 'Metabolismo Energético',
      'grasa.metabolismo.content':
        'El metabolismo energético es el conjunto de procesos que convierten los nutrientes en energía utilizable. L-Carnitina: Facilita el transporte de ácidos grasos a la mitocondria para su uso como energía. Magnesio: Esencial para más de 300 reacciones metabólicas, incluyendo la producción de energía. Omega-3: Mejora la sensibilidad a la insulina y favorece el metabolismo de las grasas. Vitamina D: Relacionada con una mejor composición corporal y metabolismo activo. Ejercicio regular: Aumenta el gasto calórico y la eficiencia metabólica.',
      'deportes.yoga.title': 'Yoga',
      'deportes.yoga.content':
        'Ashwagandha: Reduce el estrés y mejora la flexibilidad. Magnesio: Ayuda a la relajación muscular. Omega-3: Favorece la recuperación y la salud articular.',
      'deportes.natacion.title': 'Natación',
      'deportes.natacion.content':
        'Electrolitos: Mantienen la hidratación durante el ejercicio. Proteína: Para la recuperación muscular. Magnesio: Previene calambres y mejora el rendimiento acuático.',
      'grasa.stats.title': 'Estadísticas de Pérdida de Grasa',
      'grasa.stats.termogenicos':
        'Los termogénicos pueden aumentar el gasto calórico en un 3-10%',
      'grasa.stats.apetito':
        'El 78% de las personas que controlan su apetito logran mantener su peso objetivo',
      'grasa.stats.fundamentos':
        'La combinación de dieta, ejercicio y suplementos aumenta la pérdida de grasa en un 35%',
      'mujer.integral.title': 'Salud Integral Femenina',
      'mujer.osea-belleza.title': 'Salud Ósea y Belleza',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

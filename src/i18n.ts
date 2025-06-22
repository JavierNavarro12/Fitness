import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.custom": "Personalize",
      "nav.reports": "Reports",
      "megaMenu.conocenos": "About Us",
      "megaMenu.deportes": "Sports",
      "megaMenu.salud": "Health",
      "megaMenu.grasa": "Fat Burn",
      "megaMenu.mujer": "Women",
      "megaMenu.cognitivo": "Cognitive",
      "salud.vitaminas.title": "Essential Vitamins",
      "salud.minerales.title": "Key Minerals",
      "salud.antioxidantes.title": "Antioxidants and Omega-3",
      "deportes.pesas.title": "Weightlifting / Bodybuilding",
      "deportes.crossfit.title": "Crossfit / HIIT",
      "deportes.resistencia.title": "Cycling / Running / Endurance Sports",
      "deportes.equipo.title": "Team Sports",
      "grasa.termogenicos.title": "Thermogenics: Accelerate your Metabolism",
      "grasa.apetito.title": "Appetite Control",
      "grasa.fundamentos.title": "Fundamentals of Fat Burning",
      "mujer.fundamentos.title": "Fundamentals for Women",
      "mujer.equilibrio.title": "Hormonal Balance and Skin",
      "mujer.escucha.title": "Listen to your Body",
      "cognitivo.nootropicos.title": "Nootropics: Boost your Focus",
      "cognitivo.adaptogenos.title": "Adaptogens and Stress",
      "cognitivo.salud.title": "Long-term Brain Health",
      "cognitivo.estrategias.title": "Cognitive Optimization Strategies",
      "salud.vitaminas.content": "Vitamin D: For bone health and immunity. B-complex Vitamins: Essential for energy and metabolism. Vitamin C: Powerful antioxidant.",
      "salud.minerales.content": "Magnesium: For muscle recovery and sleep. Zinc: Key for testosterone and immunity. Iron: Essential for oxygen transport, especially for women.",
      "salud.antioxidantes.content": "Omega-3: Reduces inflammation and improves cardiovascular health. Coenzyme Q10: Vital for cellular energy. Curcumin: Powerful anti-inflammatory.",
      "deportes.pesas.content": "Creatine: Improves strength and power. BCAAs: Reduces muscle fatigue. Beta-Alanine: Increases endurance during short and intense efforts.",
      "deportes.crossfit.content": "HMB: Prevents muscle breakdown. Citrulline Malate: Improves blood flow and reduces fatigue. Taurine: Supports cell hydration and metabolism.",
      "deportes.resistencia.content": "Electrolytes: For proper hydration. Carbohydrates: Quick energy source during exercise. Caffeine: Improves focus and reduces perception of effort.",
      "deportes.equipo.content": "Glutamine: Supports recovery and the immune system. Arginine: Improves blood flow. Nitrates (from beet): Enhance efficiency in oxygen use.",
      "grasa.termogenicos.content": "Green Tea Extract: Boosts metabolism. Cayenne Pepper: Increases body temperature and calorie burning. Synephrine: Stimulant that can increase fat burning.",
      "grasa.apetito.content": "Glucomannan: Soluble fiber that promotes satiety. Garcinia Cambogia: May block fat production. 5-HTP: Helps regulate appetite and mood.",
      "grasa.fundamentos.content": "L-Carnitine: Helps transport fatty acids to be used as energy. CLA (Conjugated Linoleic Acid): May reduce body fat.",
      "mujer.fundamentos.content": "Folic Acid: Essential for cellular health. Calcium: Key for bone health, especially after menopause. Iron: To prevent anemia, common in women.",
      "mujer.equilibrio.content": "DIM (Diindolylmethane): Helps balance estrogen. Vitex Agnus-Castus: Can regulate menstrual cycles. Collagen: For healthy skin, hair, and nails.",
      "mujer.escucha.content": "Evening Primrose Oil: May alleviate premenstrual symptoms. Probiotics: For digestive and vaginal health. Ashwagandha: Adaptogen to manage stress.",
      "cognitivo.nootropicos.content": "L-Theanine and Caffeine: Synergistic combination for calm focus and without nervousness. Bacopa Monnieri: An adaptogenic herb that improves memory and reduces anxiety with continued use. Ginkgo Biloba: Known for improving circulation and cognitive function.",
      "cognitivo.adaptogenos.content": "Rhodiola Rosea: Fights mental and physical fatigue. Panax Ginseng: Improves memory and mood. Cordyceps: May increase energy and oxygen utilization.",
      "cognitivo.salud.content": "Phosphatidylserine: Key for cognitive function. Lion's Mane: Mushroom that can stimulate nerve growth. DHA (Omega-3): Essential for brain structure.",
      "cognitivo.estrategias.content": "Intermittent Fasting: May improve mental clarity. Quality Sleep: Essential for memory consolidation. Meditation: Reduces stress and improves focus."
    }
  },
  es: {
    translation: {
      "nav.home": "Inicio",
      "nav.custom": "Personalizar",
      "nav.reports": "Informes",
      "megaMenu.conocenos": "Conócenos",
      "megaMenu.deportes": "Deportes",
      "megaMenu.salud": "Salud",
      "megaMenu.grasa": "Quema Grasa",
      "megaMenu.mujer": "Mujer",
      "megaMenu.cognitivo": "Cognitivo",
      "salud.vitaminas.title": "Vitaminas Esenciales",
      "salud.minerales.title": "Minerales Clave",
      "salud.antioxidantes.title": "Antioxidantes y Omega-3",
      "deportes.pesas.title": "Levantamiento de Pesas / Culturismo",
      "deportes.crossfit.title": "Crossfit / HIIT",
      "deportes.resistencia.title": "Ciclismo / Running / Deportes de Resistencia",
      "deportes.equipo.title": "Deportes de Equipo",
      "grasa.termogenicos.title": "Termogénicos: Acelera tu Metabolismo",
      "grasa.apetito.title": "Control del Apetito",
      "grasa.fundamentos.title": "Fundamentos de la Quema de Grasa",
      "mujer.fundamentos.title": "Fundamentos para la Mujer",
      "mujer.equilibrio.title": "Equilibrio Hormonal y Piel",
      "mujer.escucha.title": "Escucha a tu Cuerpo",
      "cognitivo.nootropicos.title": "Nootrópicos: Potencia tu Enfoque",
      "cognitivo.adaptogenos.title": "Adaptógenos y Estrés",
      "cognitivo.salud.title": "Salud Cerebral a Largo Plazo",
      "cognitivo.estrategias.title": "Estrategias de Optimización Cognitiva",
      "salud.vitaminas.content": "Vitamina D: Para la salud ósea y la inmunidad. Vitaminas del complejo B: Esenciales para la energía y el metabolismo. Vitamina C: Potente antioxidante.",
      "salud.minerales.content": "Magnesio: Para la recuperación muscular y el sueño. Zinc: Clave para la testosterona y la inmunidad. Hierro: Fundamental para el transporte de oxígeno, especialmente en mujeres.",
      "salud.antioxidantes.content": "Omega-3: Reduce la inflamación y mejora la salud cardiovascular. Coenzima Q10: Vital para la energía celular. Cúrcuma: Potente antiinflamatorio.",
      "deportes.pesas.content": "Creatina: Mejora la fuerza y la potencia. BCAAs: Reduce la fatiga muscular. Beta-Alanina: Aumenta la resistencia en esfuerzos cortos e intensos.",
      "deportes.crossfit.content": "HMB: Evita el catabolismo muscular. Citrulina Malato: Mejora el flujo sanguíneo y reduce la fatiga. Taurina: Apoya la hidratación celular y el metabolismo.",
      "deportes.resistencia.content": "Electrolitos: Para una correcta hidratación. Carbohidratos: Fuente de energía rápida durante el ejercicio. Cafeína: Mejora el enfoque y reduce la percepción de esfuerzo.",
      "deportes.equipo.content": "Glutamina: Apoya la recuperación y el sistema inmune. Arginina: Mejora el flujo sanguíneo. Nitratos (de remolacha): Mejoran la eficiencia en el uso del oxígeno.",
      "grasa.termogenicos.content": "Extracto de Té Verde: Impulsa el metabolismo. Pimienta de Cayena: Aumenta la temperatura corporal y la quema de calorías. Sinefrina: Estimulante que puede aumentar la quema de grasa.",
      "grasa.apetito.content": "Glucomanano: Fibra soluble que promueve la saciedad. Garcinia Cambogia: Puede bloquear la producción de grasa. 5-HTP: Ayuda a regular el apetito y el estado de ánimo.",
      "grasa.fundamentos.content": "L-Carnitina: Ayuda a transportar los ácidos grasos para ser usados como energía. CLA (Ácido Linoleico Conjugado): Puede reducir la grasa corporal.",
      "mujer.fundamentos.content": "Ácido fólico: Imprescindible para la salud celular. Calcio: Clave para la salud ósea, sobre todo tras la menopausia. Hierro: Para prevenir la anemia, frecuente en mujeres.",
      "mujer.equilibrio.content": "DIM (Diindolilmetano): Ayuda a balancear los estrógenos. Vitex Agnus-Castus: Puede regular los ciclos menstruales. Colágeno: Para una piel, pelo y uñas saludables.",
      "mujer.escucha.content": "Aceite de Onagra: Puede aliviar los síntomas premenstruales. Probióticos: Para la salud digestiva y vaginal. Ashwagandha: Adaptógeno para gestionar el estrés.",
      "cognitivo.nootropicos.content": "L-Teanina y Cafeína: La combinación sinérgica para un enfoque calmado y sin nerviosismo. Bacopa Monnieri: Una hierba adaptogénica que mejora la memoria y reduce la ansiedad con el uso continuado. Ginkgo Biloba: Conocido por mejorar la circulación y la función cognitiva.",
      "cognitivo.adaptogenos.content": "Rhodiola Rosea: Combate la fatiga mental y física. Panax Ginseng: Mejora la memoria y el estado de ánimo. Cordyceps: Puede aumentar la energía y la utilización de oxígeno.",
      "cognitivo.salud.content": "Fosfatidilserina: Clave para la función cognitiva. Melena de León: Seta que puede estimular el crecimiento nervioso. DHA (Omega-3): Esencial para la estructura cerebral.",
      "cognitivo.estrategias.content": "Ayuno intermitente: Puede mejorar la claridad mental. Sueño de calidad: Imprescindible para la consolidación de la memoria. Meditación: Reduce el estrés y mejora el enfoque."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
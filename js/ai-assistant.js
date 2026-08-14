/* ============================================================
   HEALTHPLUS PHARMACY — AI HEALTH ASSISTANT
   File: js/ai-assistant.js
   Purpose: Rule-based (no external API) symptom-guidance chat
            widget. Matches free-text or quick-reply symptoms to
            general self-care advice + relevant OTC medicine
            categories, with hard-coded safety red-flag detection
            that always overrides normal advice.
   Loaded: every page (site-wide floating button).
   Depends on: none (self-contained). Deep-links to
            order-online.html?cat=... to shop suggested categories.
   ============================================================ */

(function () {
  'use strict';

  /* ── SAFETY: self-harm / crisis detection (always checked first) ── */
  var SELF_HARM_KEYWORDS = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'end it all',
    'want to die', 'self harm', 'self-harm', 'hurt myself', 'no reason to live'
  ];

  var CRISIS_RESPONSE =
    "I'm really sorry you're going through this — please know you don't have to face it alone. " +
    "If you're in immediate danger, please call Ghana's emergency line <strong>112</strong> right now, or go to the nearest hospital. " +
    "You can also reach the Mental Health Authority's toll-free support line <strong>0800 678 678</strong> to talk to someone. " +
    "If you can, please also reach out to a family member or friend you trust to be with you right now. " +
    "I'm not able to provide medical or emergency care myself, but these services can help.";

  /* ── SAFETY: emergency red flags (checked before normal advice) ── */
  var RED_FLAGS = [
    {
      keywords: ['chest pain', 'crushing pain', 'tight chest', "can't breathe", 'cannot breathe', 'difficulty breathing', 'shortness of breath'],
      response: "Chest pain or serious difficulty breathing can be a medical emergency (possible heart or lung problem). Please call <strong>112</strong> or get to the nearest emergency room immediately. Please don't wait to see if it passes."
    },
    {
      keywords: ['stroke', 'face drooping', 'slurred speech', 'one side weak', 'sudden weakness', "can't speak properly"],
      response: "These can be signs of a stroke, where every minute matters. Please call <strong>112</strong> or get to the nearest emergency room right away."
    },
    {
      keywords: ['severe bleeding', 'heavy bleeding', "won't stop bleeding", 'bleeding a lot'],
      response: "Severe or uncontrolled bleeding needs emergency care. Please apply firm pressure to the area and get to the nearest emergency room or call <strong>112</strong> immediately."
    },
    {
      keywords: ['seizure', 'convulsion', 'fitting', 'unconscious', 'unresponsive', 'fainted and not waking'],
      response: "A seizure or loss of consciousness needs urgent medical attention. Please call <strong>112</strong> or get to the nearest emergency room now."
    },
    {
      keywords: ['throat swelling', 'swollen throat', 'swollen lips', 'swollen face', 'anaphyla', 'severe allergic reaction'],
      response: "Swelling of the face, lips or throat can be a severe allergic reaction (anaphylaxis), which is life-threatening. Please call <strong>112</strong> or go to the nearest emergency room immediately. If an adrenaline auto-injector is available, use it now."
    },
    {
      keywords: ['snake bite', 'snakebite'],
      response: "For a snake bite: keep the person calm and still, keep the bitten area below heart level, and get to the nearest hospital immediately — please call <strong>112</strong>. Do not cut the wound or apply a tight tourniquet."
    },
    {
      keywords: ['overdose', 'took too many pills', 'poisoning', 'swallowed poison', 'drank poison'],
      response: "A suspected overdose or poisoning is a medical emergency. Please call <strong>112</strong> or go to the nearest emergency room immediately — bring the medicine/substance container with you if possible."
    },
    {
      keywords: ['baby fever', 'infant fever', 'newborn fever', 'baby not feeding', 'baby very sleepy'],
      response: "A fever or poor feeding in a young baby (under 3 months) needs urgent medical review — please take your baby to a hospital or clinic right away."
    },
    {
      keywords: ['pregnant and bleeding', 'pregnancy bleeding', 'bleeding while pregnant', 'severe pregnancy pain'],
      response: "Bleeding or severe pain during pregnancy needs urgent medical attention. Please go to the nearest hospital or call <strong>112</strong> right away."
    }
  ];

  /* ── SYMPTOM → SELF-CARE + OTC CATEGORY RULES ── */
  var SYMPTOM_RULES = [
    {
      id: 'headache',
      keywords: ['headache', 'migraine', 'head pain', 'head ache'],
      summary: "Headaches are often caused by dehydration, stress, poor sleep, or eye strain. Rest in a quiet, dim room, drink water, and an OTC pain reliever can help with occasional headaches.",
      action: "A simple analgesic like paracetamol or ibuprofen is usually enough for occasional headaches.",
      cat: 'Analgesic',
      seeDoctorIf: "the headache is the worst you've ever had, comes on suddenly, or comes with fever, stiff neck, vision changes, or confusion."
    },
    {
      id: 'fever',
      keywords: ['fever', 'chills', 'hot body', 'high temperature', 'sweating and cold'],
      summary: "Fever with chills and body aches is common with malaria in Ghana, as well as with other infections. It's best to get a malaria test (RDT) at a pharmacy or clinic before starting antimalarial treatment, so you get the right treatment.",
      action: "Paracetamol can help bring the fever down and ease body aches while you arrange a test. Drink plenty of fluids and rest.",
      cat: 'Analgesic',
      seeDoctorIf: "the fever is above 39°C, lasts more than 2 days, or comes with severe headache, stiff neck, repeated vomiting, or a rash."
    },
    {
      id: 'cough_cold',
      keywords: ['cough', 'cold', 'runny nose', 'blocked nose', 'sore throat', 'sneezing', 'flu'],
      summary: "Coughs, colds and sore throats are usually caused by viral infections and improve on their own within a week or two with rest and fluids.",
      action: "A cough syrup or lozenges can ease symptoms, and warm salt-water gargles help a sore throat.",
      cat: 'Respiratory',
      seeDoctorIf: "the cough lasts more than 2–3 weeks, brings up blood or thick green/yellow phlegm, or comes with chest pain or breathlessness."
    },
    {
      id: 'stomach',
      keywords: ['stomach ache', 'stomach pain', 'abdominal pain', 'diarrhea', 'diarrhoea', 'vomiting', 'indigestion', 'bloating', 'nausea'],
      summary: "Mild stomach upset, indigestion or short-lived diarrhea is often due to diet or a mild infection. Staying hydrated matters most, especially with diarrhea or vomiting.",
      action: "Oral rehydration salts (ORS) help replace fluids lost to diarrhea/vomiting. Antacids can ease indigestion.",
      cat: 'Gastrointestinal',
      seeDoctorIf: "there's blood in vomit or stool, signs of dehydration (very little urine, dizziness), severe pain, or symptoms last more than 2 days."
    },
    {
      id: 'allergy',
      keywords: ['allergy', 'allergies', 'itching', 'itchy skin', 'hives', 'rash', 'hay fever', 'sneezing a lot'],
      summary: "Mild allergic reactions like itching, hives or hay fever can often be managed with an antihistamine and by avoiding the trigger if you know it.",
      action: "An OTC antihistamine (like cetirizine) can relieve itching and sneezing.",
      cat: 'Antihistamine',
      seeDoctorIf: "the reaction spreads quickly, or you notice swelling of the face/lips/throat or difficulty breathing — that needs emergency care, not self-treatment."
    },
    {
      id: 'skin_fungal',
      keywords: ['ringworm', 'athletes foot', "athlete's foot", 'fungal infection', 'skin infection', 'jock itch'],
      summary: "Ringworm and athlete's foot are common fungal skin infections that usually respond well to topical antifungal treatment. Keep the area clean and dry.",
      action: "An antifungal cream applied as directed for the full course usually clears it up.",
      cat: 'Antifungal',
      seeDoctorIf: "it doesn't improve after 2 weeks of treatment, spreads, or looks infected (pus, increasing redness, fever)."
    },
    {
      id: 'constipation',
      keywords: ['constipation', 'constipated', "can't poop", 'hard stool'],
      summary: "Constipation often improves with more water, fibre (fruits, vegetables, whole grains) and gentle movement.",
      action: "A mild laxative can help short-term if diet changes aren't enough.",
      cat: 'Gastrointestinal',
      seeDoctorIf: "it lasts more than a week, or comes with severe pain, blood in stool, or vomiting."
    },
    {
      id: 'menstrual',
      keywords: ['period pain', 'menstrual cramps', 'menstrual pain', 'period cramps'],
      summary: "Period cramps are common and usually manageable with rest, a warm compress on the abdomen, and a pain reliever.",
      action: "An analgesic like ibuprofen (taken with food) is often effective for period pain.",
      cat: 'Analgesic',
      seeDoctorIf: "the pain is severe, worsening over time, or very different from your usual periods."
    },
    {
      id: 'toothache',
      keywords: ['toothache', 'tooth pain', 'tooth ache'],
      summary: "A toothache is usually a sign of a dental problem (cavity, infection) that needs a dentist to properly treat — pain relief only manages symptoms temporarily.",
      action: "A pain reliever can ease discomfort while you arrange a dental visit.",
      cat: 'Analgesic',
      seeDoctorIf: "there's facial swelling, fever, or the pain is severe — please see a dentist as soon as possible."
    },
    {
      id: 'insomnia_anxiety',
      keywords: ['anxiety', 'anxious', "can't sleep", 'insomnia', 'stress', 'panic attack', 'depressed', 'depression'],
      summary: "Sleep and mood difficulties deserve proper attention rather than self-medicating, since the right approach really depends on what's underlying it.",
      action: "I'd recommend speaking with a doctor or counsellor about this rather than an OTC medicine — they can help you find what actually works.",
      cat: null,
      seeDoctorIf: "you're having trouble coping day-to-day, or these feelings are persistent — please don't hesitate to reach out to a professional."
    },
    {
      id: 'bp_diabetes',
      keywords: ['blood pressure', 'hypertension', 'diabetes', 'blood sugar', 'sugar level'],
      summary: "Blood pressure and diabetes management need regular monitoring and a treatment plan from a doctor — these aren't conditions to self-adjust medication for.",
      action: "If you're already on treatment, please don't change your dose without medical advice. Our pharmacist can help with monitoring supplies and general guidance.",
      cat: null,
      seeDoctorIf: "your readings are very high/low, or you feel unwell — please seek medical review."
    },
    {
      id: 'eye',
      keywords: ['red eye', 'eye irritation', 'itchy eyes', 'eye infection'],
      summary: "Mild eye redness or irritation, e.g. from dust or allergies, sometimes settles with lubricating or antiseptic eye drops.",
      action: "Antiseptic/lubricating eye drops can help with mild irritation.",
      cat: 'Ophthalmic',
      seeDoctorIf: "there's pain, vision changes, discharge, or it doesn't improve in a couple of days — please see a doctor, as eye problems can worsen quickly."
    }
  ];

  var GENERIC_FALLBACK =
    "Thanks for sharing that. I can offer general guidance on common symptoms like headaches, fever, cough & cold, stomach upset, allergies, and skin infections. " +
    "Could you tell me a bit more about what you're experiencing? If it's something urgent or doesn't fit those categories, our pharmacist can help — you can reach us via the WhatsApp Support button, or visit in person.";

  var DISCLAIMER =
    "This is general guidance only, not a medical diagnosis. For anything persistent, severe, or if you're unsure, please speak with our pharmacist or a doctor.";

  function containsAny(text, keywords) {
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  /* Returns a response object: { type, html, cat } */
  function matchSymptoms(rawText) {
    var text = (rawText || '').toLowerCase();

    if (containsAny(text, SELF_HARM_KEYWORDS)) {
      return { type: 'crisis', html: CRISIS_RESPONSE, cat: null };
    }

    for (var i = 0; i < RED_FLAGS.length; i++) {
      if (containsAny(text, RED_FLAGS[i].keywords)) {
        return { type: 'emergency', html: RED_FLAGS[i].response, cat: null };
      }
    }

    for (var j = 0; j < SYMPTOM_RULES.length; j++) {
      var rule = SYMPTOM_RULES[j];
      if (containsAny(text, rule.keywords)) {
        var html = '<strong>' + rule.summary + '</strong><br><br>' +
          rule.action + '<br><br>' +
          '<em>See a doctor if:</em> ' + rule.seeDoctorIf + '<br><br>' +
          '<span style="font-size:11px;opacity:0.75;">' + DISCLAIMER + '</span>';
        return { type: 'advice', html: html, cat: rule.cat, ruleId: rule.id };
      }
    }

    return { type: 'fallback', html: GENERIC_FALLBACK, cat: null };
  }

  /* ── CHAT UI STATE ── */
  var chatOpen = false;
  var chatStarted = false;

  window.toggleAIChat = function () {
    var panel = document.getElementById('ai-chat-panel');
    var stack = document.getElementById('float-btn-stack');
    if (!panel) return;
    chatOpen = !chatOpen;
    if (chatOpen) {
      panel.classList.add('open');
      if (stack) stack.classList.add('fabs-hidden');
      if (!chatStarted) startAIChat();
    } else {
      panel.classList.remove('open');
      if (stack) stack.classList.remove('fabs-hidden');
    }
  };

  function scrollChatToBottom() {
    var box = document.getElementById('ai-chat-messages');
    if (box) box.scrollTop = box.scrollHeight;
  }

  function addBubble(text, who) {
    var box = document.getElementById('ai-chat-messages');
    if (!box) return;
    var wrap = document.createElement('div');
    wrap.className = 'ai-bubble ' + (who === 'user' ? 'ai-bubble-user' : 'ai-bubble-ai');
    var content = document.createElement('div');
    content.className = 'ai-bubble-content';
    content.innerHTML = text;
    wrap.appendChild(content);
    box.appendChild(wrap);
    scrollChatToBottom();
  }

  function addShopButton(cat) {
    if (!cat) return;
    var box = document.getElementById('ai-chat-messages');
    if (!box) return;
    var wrap = document.createElement('div');
    wrap.className = 'ai-bubble ai-bubble-ai';
    var content = document.createElement('div');
    content.className = 'ai-bubble-content';
    var safeCat = encodeURIComponent(cat);
    content.innerHTML = '<a class="ai-quick-chip" style="display:inline-block;text-decoration:none;" ' +
      'href="order-online.html?cat=' + safeCat + '">🛒 Shop related medicines</a>';
    wrap.appendChild(content);
    box.appendChild(wrap);
    scrollChatToBottom();
  }

  function showTyping() {
    var box = document.getElementById('ai-chat-messages');
    if (!box) return;
    var wrap = document.createElement('div');
    wrap.className = 'ai-bubble ai-bubble-ai';
    wrap.id = 'ai-typing-bubble';
    wrap.innerHTML = '<div class="ai-bubble-content ai-typing-dots"><span></span><span></span><span></span></div>';
    box.appendChild(wrap);
    scrollChatToBottom();
  }

  function hideTyping() {
    var el = document.getElementById('ai-typing-bubble');
    if (el) el.remove();
  }

  function renderQuickReplies(options) {
    var row = document.getElementById('ai-quick-replies');
    if (!row) return;
    row.innerHTML = '';
    options.forEach(function (opt) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ai-quick-chip';
      chip.textContent = opt;
      chip.onclick = function () { handleUserInput(opt); };
      row.appendChild(chip);
    });
  }

  var STARTER_CHIPS = ['Headache', 'Fever & chills', 'Cough & cold', 'Stomach upset', 'Allergies / itching', 'Skin infection'];

  function startAIChat() {
    chatStarted = true;
    addBubble(
      "Hi, I'm the HealthPlus AI Health Assistant 👋<br>Tell me what symptoms you're experiencing, or pick one below, and I'll share general guidance and suggest relevant over-the-counter options.",
      'ai'
    );
    renderQuickReplies(STARTER_CHIPS);
  }

  function handleUserInput(text) {
    if (!text || !text.trim()) return;
    addBubble(escapeHtml(text), 'user');
    renderQuickReplies([]);
    showTyping();
    setTimeout(function () {
      hideTyping();
      var result = matchSymptoms(text);
      addBubble(result.html, 'ai');
      if (result.type === 'advice' && result.cat) {
        addShopButton(result.cat);
      }
      if (result.type === 'advice' || result.type === 'fallback') {
        renderQuickReplies(STARTER_CHIPS.concat(['Something else']));
      }
    }, 500 + Math.random() * 400);
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  window.sendAIMessage = function () {
    var input = document.getElementById('ai-chat-input');
    if (!input) return;
    var text = input.value;
    input.value = '';
    handleUserInput(text);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('ai-chat-input');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.sendAIMessage();
        }
      });
    }

    /* Optional inline symptom-checker box (used on order-online.html) */
    var scBtn = document.getElementById('symptom-check-btn');
    if (scBtn) {
      scBtn.addEventListener('click', function () {
        var ta = document.getElementById('symptom-input');
        var resultBox = document.getElementById('symptom-result');
        if (!ta || !resultBox) return;
        var text = ta.value.trim();
        if (!text) {
          resultBox.innerHTML = '<p style="color:var(--sage);font-size:13.5px;">Please describe what you\'re experiencing first.</p>';
          return;
        }
        var result = matchSymptoms(text);
        var urgencyLabel = result.type === 'emergency' || result.type === 'crisis'
          ? '⚠️ Seek care now' : (result.type === 'advice' ? 'General guidance' : 'Tell me more');
        var urgencyColor = (result.type === 'emergency' || result.type === 'crisis') ? 'var(--coral)' : 'var(--teal)';
        var shopLink = (result.type === 'advice' && result.cat)
          ? '<a href="order-online.html?cat=' + encodeURIComponent(result.cat) + '" class="ai-quick-chip" style="display:inline-block;text-decoration:none;margin-top:10px;">🛒 Shop related medicines</a>'
          : '';
        resultBox.innerHTML =
          '<div class="symptom-result-card" style="background:var(--white);">' +
            '<div class="sr-urgency" style="color:' + urgencyColor + ';">' + urgencyLabel + '</div>' +
            '<div class="sr-summary">' + result.html + '</div>' +
            shopLink +
          '</div>';
      });
    }
  });
})();

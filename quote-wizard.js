(function () {
  var root = document.querySelector('.qb');
  if (!root) return;
  // Service pages preset the job type, e.g. <div class="qb" data-job="switchboard">
  var presetJob = root.getAttribute('data-job') || '';
  var introTitle = root.getAttribute('data-intro-title') || 'Get your free quote';
  var MAX_PHOTOS = 5;

  // ---------- data ----------
  var JOB_OPTIONS = [
    { value: 'switchboard', label: 'Switchboard upgrade', sub: 'Old fuse box, safety switch, insurance requirement' },
    { value: 'lighting', label: 'Lighting', sub: 'Downlights, outdoor lighting, ceiling fans, dimmers' },
    { value: 'ev', label: 'EV charger install', sub: 'Home charger for an electric vehicle' },
    { value: 'repair', label: 'General repair or fault', sub: 'Something is not working right' },
    { value: 'reno', label: 'Renovation or new circuit', sub: 'Kitchen, bathroom, extension, granny flat' },
    { value: 'smoke', label: 'Smoke alarms', sub: 'Install, replace or bring up to code' },
    { value: 'rewire', label: 'Rewiring', sub: 'Full or partial rewire of an older property' },
    { value: 'other', label: 'Something else', sub: '' }
  ];

  var STEP_DEFS = {
    jobType: {
      type: 'single', key: 'jobType',
      title: "What's the job?",
      sub: "Pick the closest one — there's room for detail later.",
      options: JOB_OPTIONS
    },
    switchboard_reason: {
      type: 'single', key: 'switchboardReason',
      title: "What's prompting the upgrade?",
      options: [
        { value: 'fusebox', label: 'Still on an old fuse box' },
        { value: 'trips', label: 'Safety switch keeps tripping' },
        { value: 'insurance', label: 'Insurer or bank requires it' },
        { value: 'renovating', label: 'Renovating and need more capacity' },
        { value: 'unsure', label: 'Not sure — want it assessed' }
      ]
    },
    phase: {
      type: 'single', key: 'phase',
      title: 'Single or three-phase power?',
      sub: "Not sure? That's fine — I'll check when I'm there.",
      options: [
        { value: 'single', label: 'Single-phase' },
        { value: 'three', label: 'Three-phase' },
        { value: 'unsure', label: 'Not sure' }
      ]
    },
    lighting_scope: {
      type: 'multi', key: 'lightingScope',
      title: 'What kind of lighting work?',
      sub: 'Select all that apply.',
      options: [
        { value: 'downlights', label: 'LED downlights' },
        { value: 'outdoor', label: 'Outdoor or garden lighting' },
        { value: 'fans', label: 'Ceiling fans' },
        { value: 'dimmers', label: 'Dimmer switches' },
        { value: 'other', label: 'Something else' }
      ]
    },
    lighting_count: {
      type: 'single', key: 'lightingCount',
      title: 'Roughly how many lights?',
      options: [
        { value: '1-3', label: '1–3' },
        { value: '4-8', label: '4–8' },
        { value: '9+', label: '9 or more' },
        { value: 'unsure', label: 'Not sure yet' }
      ]
    },
    ev_charger: {
      type: 'single', key: 'evCharger',
      title: 'Do you already have a charger?',
      options: [
        { value: 'have', label: 'Yes, I have the charger' },
        { value: 'need', label: 'No, I need help choosing one' },
        { value: 'unsure', label: 'Not sure yet' }
      ]
    },
    ev_location: {
      type: 'single', key: 'evLocation',
      title: 'Where will it be installed?',
      options: [
        { value: 'garage', label: 'Garage' },
        { value: 'carport', label: 'Carport' },
        { value: 'driveway', label: 'Open driveway' },
        { value: 'other', label: 'Somewhere else' }
      ]
    },
    ev_distance: {
      type: 'single', key: 'evDistance',
      title: 'How far is that from the switchboard?',
      sub: "A rough guess is fine — it affects how much cable is needed.",
      options: [
        { value: 'near', label: 'Close by (under 5m)' },
        { value: 'medium', label: 'Medium run (5–15m)' },
        { value: 'far', label: 'Long run (15m+)' },
        { value: 'unsure', label: 'Not sure' }
      ]
    },
    repair_symptoms: {
      type: 'multi', key: 'repairSymptoms',
      title: "What's happening?",
      sub: 'Select all that apply.',
      options: [
        { value: 'outage', label: 'Power out in part of the house' },
        { value: 'notworking', label: 'A switch or power point not working' },
        { value: 'flicker', label: 'Lights flickering or dimming' },
        { value: 'rcd', label: 'Safety switch (RCD) keeps tripping' },
        { value: 'hazard', label: 'Burning smell, sparking or scorch marks' },
        { value: 'other', label: 'Something else' }
      ]
    },
    reno_scope: {
      type: 'single', key: 'renoScope',
      title: 'What best describes the scope?',
      options: [
        { value: 'kitchen', label: 'Kitchen renovation' },
        { value: 'bathroom', label: 'Bathroom renovation' },
        { value: 'extension', label: 'Home extension' },
        { value: 'granny', label: 'Granny flat or shed' },
        { value: 'other', label: 'Something else' }
      ]
    },
    reno_builder: {
      type: 'single', key: 'renoBuilder',
      title: 'Is a builder already involved?',
      options: [
        { value: 'yes', label: 'Yes, mid-project' },
        { value: 'planned', label: 'Not yet, still planning' },
        { value: 'diy', label: 'No builder — owner-managed' }
      ]
    },
    smoke_count: {
      type: 'single', key: 'smokeCount',
      title: 'How many smoke alarms do you have now?',
      options: [
        { value: '0', label: 'None yet' },
        { value: '1-2', label: '1–2' },
        { value: '3-5', label: '3–5' },
        { value: 'unsure', label: 'Not sure' }
      ]
    },
    smoke_type: {
      type: 'single', key: 'smokeType',
      title: 'Hardwired or battery?',
      options: [
        { value: 'hardwired', label: 'Hardwired' },
        { value: 'battery', label: 'Battery only' },
        { value: 'mixed', label: 'A mix, or not sure' }
      ]
    },
    property_age: {
      type: 'single', key: 'propertyAge',
      title: 'Roughly how old is the property?',
      sub: 'Older wiring changes what I check first.',
      options: [
        { value: 'pre1980', label: 'Built before 1980' },
        { value: '1980-2000', label: 'Built 1980–2000' },
        { value: 'post2000', label: 'Built after 2000' },
        { value: 'unsure', label: 'Not sure' }
      ]
    },
    property_storeys: {
      type: 'single', key: 'storeys',
      title: 'Single or double storey?',
      options: [
        { value: 'single', label: 'Single storey' },
        { value: 'double', label: 'Double storey' }
      ]
    },
    rewire_issues: {
      type: 'multi', key: 'rewireIssues',
      title: 'Noticed any of these?',
      sub: 'Select all that apply.',
      options: [
        { value: 'flicker', label: 'Flickering lights' },
        { value: 'trips', label: 'Frequent trips' },
        { value: 'discolour', label: 'Discoloured switches or points' },
        { value: 'none', label: 'None currently' }
      ]
    },
    other_details: {
      type: 'text', key: 'otherDetails',
      title: 'Tell me a bit more about the job',
      placeholder: "What needs doing?",
      multiline: true
    },
    property_type: {
      type: 'single', key: 'propertyType',
      title: 'What type of property is it?',
      options: [
        { value: 'house', label: 'House' },
        { value: 'townhouse', label: 'Townhouse' },
        { value: 'unit', label: 'Unit or apartment' },
        { value: 'other', label: 'Other' }
      ]
    },
    timeframe: {
      type: 'single', key: 'timeframe',
      title: 'When would you like this done?',
      options: [
        { value: 'urgent', label: 'As soon as possible' },
        { value: '2weeks', label: 'Within the next couple of weeks' },
        { value: 'flexible', label: "I'm flexible" }
      ]
    },
    photos: {
      type: 'photos', key: 'photos',
      title: 'Add a few photos (optional)',
      sub: 'Photos of the switchboard, the area or the issue help with an accurate quote.'
    },
    extra_notes: {
      type: 'text', key: 'extraNotes',
      title: 'Anything else I should know?',
      sub: 'Optional — access, parking, pets or anything else about the job.',
      placeholder: 'e.g. side gate code, dog in the backyard, best days to come',
      multiline: true
    },
    contact_name: {
      type: 'text', key: 'contactName',
      title: "What's your name?",
      placeholder: 'Full name',
      autocomplete: 'name',
      errorMsg: 'Please add your name.',
      required: true
    },
    contact_phone: {
      type: 'text', key: 'contactPhone',
      title: "What's the best number to call you on?",
      placeholder: '04xx xxx xxx',
      inputType: 'tel',
      autocomplete: 'tel',
      errorMsg: 'Please add a phone number so I can call you back.',
      required: true
    },
    contact_address: {
      type: 'text', key: 'contactAddress',
      title: "What's the address for the job?",
      placeholder: 'e.g. 12 Foreshore Rd, Dromana',
      autocomplete: 'street-address',
      errorMsg: 'Please add the job address so I can quote it properly.',
      required: true
    },
    contact_time: {
      type: 'single', key: 'contactTime',
      title: "When's the best time to call you?",
      options: [
        { value: 'morning', label: 'Morning' },
        { value: 'afternoon', label: 'Afternoon' },
        { value: 'evening', label: 'Evening' },
        { value: 'anytime', label: 'Anytime' }
      ]
    },
    safety_alert: { type: 'safety' }
  };

  var LABEL_LOOKUP = {};
  Object.keys(STEP_DEFS).forEach(function (id) {
    var def = STEP_DEFS[id];
    if (def.options) {
      LABEL_LOOKUP[id] = {};
      def.options.forEach(function (o) { LABEL_LOOKUP[id][o.value] = o.label; });
    }
  });

  function stepDef(id) {
    var def = STEP_DEFS[id];
    if (id === 'photos' && answers.jobType === 'switchboard') {
      return Object.assign({}, def, {
        title: 'Add a photo of your switchboard',
        sub: 'Open the switchboard door and take a clear photo of the whole board. I need this to quote accurately. Photos of anything else are welcome too.',
        required: true
      });
    }
    return def;
  }

  function getStepOrder(answers) {
    var order = ['jobType'];
    switch (answers.jobType) {
      case 'switchboard': order.push('switchboard_reason', 'phase'); break;
      case 'lighting': order.push('lighting_scope', 'lighting_count'); break;
      case 'ev': order.push('ev_charger', 'ev_location', 'ev_distance'); break;
      case 'repair':
        order.push('repair_symptoms');
        if (answers.repairSymptoms && answers.repairSymptoms.indexOf('hazard') !== -1) {
          order.push('safety_alert');
        }
        break;
      case 'reno': order.push('reno_scope', 'reno_builder'); break;
      case 'smoke': order.push('smoke_count', 'smoke_type'); break;
      case 'rewire': order.push('property_age', 'rewire_issues'); break;
      case 'other': order.push('other_details'); break;
      default: break;
    }
    if (answers.jobType) {
      order.push('property_type', 'property_storeys', 'timeframe', 'photos');
      // "Something else" jobs already have a free-text step
      if (answers.jobType !== 'other') order.push('extra_notes');
      order.push('contact_name', 'contact_phone', 'contact_address', 'contact_time');
    }
    return order;
  }

  // ---------- state ----------
  var answers = presetJob ? { jobType: presetJob } : {};
  var photoFiles = [];
  var currentIndex = -1; // -1 = intro, N = summary
  var submitState = 'idle'; // idle | submitting | success | error
  var submitErrorMsg = '';
  var pendingFocus = null; // {heading:true} | {option:index} | {selector:'...'}

  var stage = document.getElementById('qbStage');
  var progressFill = document.getElementById('qbProgressFill');
  var stepLabel = document.getElementById('qbStepLabel');

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function updateProgress() {
    var order = getStepOrder(answers);
    var total = order.length;
    progressFill.parentNode.style.visibility = currentIndex === -1 ? 'hidden' : 'visible';
    if (currentIndex === -1) {
      progressFill.style.width = '0%';
      stepLabel.textContent = '';
    } else if (currentIndex >= total) {
      progressFill.style.width = '100%';
      stepLabel.textContent = 'Review';
    } else {
      // Before the job type is chosen the total isn't known yet, so show a small start value
      var pct = answers.jobType ? Math.round(((currentIndex + 1) / total) * 100) : 8;
      progressFill.style.width = pct + '%';
      stepLabel.textContent = answers.jobType
        ? 'Step ' + (currentIndex + 1) + ' of ' + total
        : 'Step ' + (currentIndex + 1);
    }
  }

  function goNext() {
    var order = getStepOrder(answers);
    if (currentIndex >= 0 && currentIndex < order.length) {
      var id = order[currentIndex];
      if (!validateStep(id)) return;
    }
    currentIndex = (currentIndex === -1 && presetJob && answers.jobType === presetJob) ? 1 : currentIndex + 1;
    pendingFocus = { heading: true };
    render();
  }

  function goBack() {
    if (currentIndex <= -1) return;
    currentIndex--;
    pendingFocus = { heading: true };
    render();
  }

  function validateStep(id) {
    var def = stepDef(id);
    if (!def) return true;
    if (def.type === 'safety') return true;
    if (def.type === 'single') {
      if (answers[def.key] === undefined) { showInlineError(id); return false; }
    }
    if (def.type === 'text' && def.required) {
      if (!answers[def.key] || !answers[def.key].trim()) { showInlineError(id); return false; }
    }
    if (def.type === 'photos' && def.required && !photoFiles.length) { showInlineError(id); return false; }
    return true;
  }

  function showInlineError(id) {
    var errEl = document.getElementById('err-' + id);
    if (errEl) errEl.classList.add('show');
    var input = document.getElementById(id);
    if (input) {
      if (input.parentNode) input.parentNode.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
  }

  function renderIntro() {
    var card = el('div', { class: 'card intro' });
    card.appendChild(el('h2', { class: 'stage-title', text: introTitle }));
    card.appendChild(el('p', { class: 'stage-sub', text: 'Answer a few quick questions and I\'ll have everything I need to quote the job accurately.' }));
    var points = el('div', { class: 'intro-points' }, [
      el('div', { text: 'Takes about two minutes' }),
      el('div', { text: 'Questions adjust to the kind of job' }),
      el('div', { text: 'You can attach photos at the end' })
    ]);
    card.appendChild(points);
    var btn = el('button', { class: 'btn-primary btn-full', text: 'Start' });
    btn.addEventListener('click', goNext);
    card.appendChild(btn);
    return card;
  }

  function renderQuestion(id, def) {
    var card = el('div', { class: 'card' });
    card.appendChild(el('h2', { class: 'stage-title', id: 'qb-title-' + id, text: def.title }));
    if (def.sub) card.appendChild(el('p', { class: 'stage-sub', id: 'qb-sub-' + id, text: def.sub }));

    if (def.type === 'single' || def.type === 'multi') {
      var isMulti = def.type === 'multi';
      var groupAttrs = { class: 'options', role: isMulti ? 'group' : 'radiogroup', 'aria-labelledby': 'qb-title-' + id };
      if (def.sub) groupAttrs['aria-describedby'] = 'qb-sub-' + id;
      var opts = el('div', groupAttrs);
      def.options.forEach(function (o, optIndex) {
        var selected = isMulti
          ? (answers[def.key] || []).indexOf(o.value) !== -1
          : answers[def.key] === o.value;
        var indicator = el('div', { class: 'indicator' });
        var textWrap = el('div', { class: 'option-text' }, [
          el('div', { class: 'option-label', text: o.label }),
          o.sub ? el('div', { class: 'option-sub', text: o.sub }) : null
        ]);
        var opt = el('div', {
          class: 'option ' + (isMulti ? 'check' : 'radio') + (selected ? ' selected' : ''),
          role: isMulti ? 'checkbox' : 'radio',
          'aria-checked': selected ? 'true' : 'false',
          tabindex: '0'
        }, [indicator, textWrap]);
        opt.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
            ev.preventDefault();
            opt.click();
          }
        });
        opt.addEventListener('click', function () {
          if (isMulti) {
            var arr = answers[def.key] ? answers[def.key].slice() : [];
            var i = arr.indexOf(o.value);
            if (i === -1) arr.push(o.value); else arr.splice(i, 1);
            answers[def.key] = arr;
          } else {
            answers[def.key] = o.value;
          }
          clearError(id);
          pendingFocus = { option: optIndex };
          render();
          if (!isMulti) {
            setTimeout(goNext, 140);
          }
        });
        opts.appendChild(opt);
      });
      card.appendChild(opts);
      if (def.type === 'multi') {
        var err = el('div', { class: 'inline-error', id: 'err-' + id, text: 'Pick at least one, or Continue if none apply.' });
        card.appendChild(err);
      }
      if (isMulti) card.appendChild(navRow(id, true));
    }

    if (def.type === 'text') {
      var field = el('div', { class: 'field' });
      field.appendChild(el('label', { for: id, text: def.title, class: 'sr-only' }));
      var inputAttrs = { id: id, placeholder: def.placeholder || '', 'aria-describedby': 'err-' + id };
      if (def.required) inputAttrs['aria-required'] = 'true';
      if (def.autocomplete) inputAttrs.autocomplete = def.autocomplete;
      var input;
      if (def.multiline) {
        inputAttrs.rows = '4';
        input = el('textarea', inputAttrs);
      } else {
        inputAttrs.type = def.inputType || 'text';
        input = el('input', inputAttrs);
        input.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter') { ev.preventDefault(); goNext(); }
        });
      }
      input.value = answers[def.key] || '';
      input.addEventListener('input', function () {
        answers[def.key] = input.value;
        clearError(id);
      });
      field.appendChild(input);
      var errT = el('div', { class: 'field-error', id: 'err-' + id, text: def.errorMsg || 'Please fill this in to continue.' });
      field.appendChild(errT);
      card.appendChild(field);
      card.appendChild(navRow(id, true));
    }

    if (def.type === 'photos') {
      var upload = el('div', { class: 'photo-upload' });
      var icon = el('div', { html: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' });
      var fileInput = el('input', { type: 'file', accept: 'image/*', multiple: 'multiple', id: 'qb-photos',
        'aria-label': def.required ? 'Choose a photo of your switchboard' : 'Choose photos of the job (optional)',
        'aria-describedby': 'err-' + id });
      var utext = el('div', { class: 'u-text', text: photoFiles.length
        ? (photoFiles.length + (photoFiles.length === 1 ? ' photo added' : ' photos added') + (photoFiles.length >= MAX_PHOTOS ? ' (max ' + MAX_PHOTOS + ')' : ' — add more'))
        : (def.required ? 'Choose or take a photo' : 'Choose photos') });
      upload.appendChild(icon);
      upload.appendChild(utext);
      upload.appendChild(fileInput);
      card.appendChild(upload);

      var thumbs = el('div', { class: 'thumbs' });
      photoFiles.forEach(function (f) {
        var img = el('img', { src: URL.createObjectURL(f), alt: 'Selected photo: ' + f.name });
        thumbs.appendChild(img);
      });
      card.appendChild(thumbs);

      if (photoFiles.length) {
        var clear = el('button', { type: 'button', class: 'qb-clear', text: 'Remove photos' });
        clear.addEventListener('click', function () {
          photoFiles = [];
          pendingFocus = { selector: '#qb-photos' };
          render();
        });
        card.appendChild(clear);
      }

      card.appendChild(el('div', { class: 'inline-error', id: 'err-' + id, role: 'alert',
        text: 'Please add a photo of your switchboard so I can quote it accurately.' }));

      fileInput.addEventListener('change', function () {
        photoFiles = photoFiles.concat(Array.from(fileInput.files || [])).slice(0, MAX_PHOTOS);
        clearError(id);
        pendingFocus = { selector: '#qb-photos' };
        render();
      });

      card.appendChild(navRow(id, true));
    }

    if (def.type === 'single') {
      var errS = el('div', { class: 'inline-error', id: 'err-' + id, text: 'Pick an option to continue.' });
      card.appendChild(errS);
      var backRow = el('div', { class: 'nav-row' });
      var backOnly = el('button', { class: 'btn-ghost', text: 'Back' });
      backOnly.addEventListener('click', goBack);
      backRow.appendChild(backOnly);
      card.appendChild(backRow);
    }

    return card;
  }

  function navRow(id, showBoth) {
    var row = el('div', { class: 'nav-row' });
    if (currentIndex > -1) {
      var back = el('button', { class: 'btn-ghost', text: 'Back' });
      back.addEventListener('click', goBack);
      row.appendChild(back);
    }
    var next = el('button', { class: 'btn-primary', text: 'Continue' });
    next.addEventListener('click', goNext);
    row.appendChild(next);
    return row;
  }

  function clearError(id) {
    var e = document.getElementById('err-' + id);
    if (e) e.classList.remove('show');
    var input = document.getElementById(id);
    if (input) {
      if (input.parentNode) input.parentNode.classList.remove('error');
      input.removeAttribute('aria-invalid');
    }
  }

  function renderSafety() {
    var wrap = el('div', {});
    var card = el('div', { class: 'safety-card' });
    card.appendChild(el('h2', { text: "Call me now — don't wait for a quote" }));
    card.appendChild(el('p', { text: "Burning smells, sparking or scorch marks can mean a live electrical hazard. If it's safe to, switch off that circuit at the switchboard, then call me straight away. If there's smoke or fire, get everyone out and call 000." }));

    var callBtn = el('a', {
      class: 'call-btn', href: 'tel:+61413432850',
      html: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Call me now &middot; <span class="call-number">0413 432 850</span>'
    });
    card.appendChild(callBtn);

    var copyRow = el('div', { class: 'copy-row' });
    var copyBtn = el('button', { text: "Number not dialling? Copy it instead" });
    var copyTag = el('span', { class: 'copied-tag' });
    copyBtn.addEventListener('click', function () {
      var text = '0413 432 850';
      function done() { copyTag.textContent = 'Copied'; setTimeout(function () { copyTag.textContent = ''; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
    copyRow.appendChild(copyBtn);
    copyRow.appendChild(copyTag);
    card.appendChild(copyRow);

    var row = el('div', { class: 'nav-row' });
    var back = el('button', { class: 'btn-ghost', text: 'Back' });
    back.addEventListener('click', goBack);
    var cont = el('button', { class: 'btn-primary', text: 'Continue with quote request' });
    cont.addEventListener('click', goNext);
    row.appendChild(back);
    row.appendChild(cont);
    card.appendChild(row);
    wrap.appendChild(card);
    return wrap;
  }

  function summaryPairs() {
    var order = getStepOrder(answers).filter(function (id) { return STEP_DEFS[id].type !== 'safety'; });
    var pairs = [];
    order.forEach(function (id) {
      var def = stepDef(id);
      var val = answers[def.key];
      var display = '';
      if (def.type === 'single') display = (LABEL_LOOKUP[id] && LABEL_LOOKUP[id][val]) || '—';
      else if (def.type === 'multi') {
        display = (val && val.length) ? val.map(function (v) { return LABEL_LOOKUP[id][v]; }).join(', ') : 'None selected';
      } else if (def.type === 'text') display = (val && val.trim()) ? val : (def.required ? '—' : 'Nothing added');
      else if (def.type === 'photos') display = photoFiles.length ? (photoFiles.length + ' attached') : 'None attached';
      pairs.push({ label: def.title, value: display });
    });
    return pairs;
  }

  // Phone photos can be 3-5 MB each and Netlify rejects requests over 8 MB,
  // so resize to max 1600px JPEG before sending. Falls back to the original file.
  function shrinkPhoto(file) {
    if (!window.createImageBitmap || !file.type || file.type.indexOf('image/') !== 0) return Promise.resolve(file);
    return createImageBitmap(file).then(function (bmp) {
      var scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      var w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          if (!blob || blob.size >= file.size) return resolve(file);
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.82);
      });
    }).catch(function () { return file; });
  }

  function submitToNetlify() {
    return Promise.all(photoFiles.map(shrinkPhoto)).then(sendForm);
  }

  function sendForm(photos) {
    var fd = new FormData();
    fd.append('form-name', 'quote-request');
    fd.append('Name', answers.contactName || '');
    fd.append('Phone', answers.contactPhone || '');
    fd.append('Address', answers.contactAddress || '');
    fd.append('Job type', (LABEL_LOOKUP.jobType && LABEL_LOOKUP.jobType[answers.jobType]) || 'Other');
    var detailLines = summaryPairs().map(function (p) { return p.label + ': ' + p.value; });
    fd.append('Details', '[Sent from the quote form on ' + (window.location.pathname || '/') + ']\n\n' + detailLines.join('\n'));
    photos.forEach(function (f, i) { fd.append('Photo' + (i + 1), f, f.name); });
    return fetch('/', { method: 'POST', body: fd }).then(function (res) {
      if (!res.ok) throw new Error('Something went wrong and your request didn\'t send (error ' + res.status + '). Please try again.');
    }).catch(function (err) {
      if (err instanceof Error && /didn't send \(error/.test(err.message)) throw err;
      throw new Error("Your request didn't send — check your internet connection and try again.");
    });
  }

  function renderSummary() {
    var card = el('div', { class: 'card' });
    card.appendChild(el('h2', { class: 'stage-title', text: 'Review your request' }));
    card.appendChild(el('p', { class: 'stage-sub', text: "Here's everything I'll receive. Check it over, then send." }));

    var list = el('div', { class: 'summary-list' });
    summaryPairs().forEach(function (p) {
      list.appendChild(el('div', { class: 'summary-row' }, [
        el('div', { class: 's-label', text: p.label }),
        el('div', { class: 's-value', text: p.value })
      ]));
    });
    card.appendChild(list);

    if (submitState === 'error') {
      card.appendChild(el('div', {
        class: 'inline-error show', role: 'alert', tabindex: '-1',
        text: (submitErrorMsg || "Couldn't send that.") + ' You can also call me on 0413 432 850.'
      }));
    }

    var row = el('div', { class: 'nav-row' });
    var back = el('button', { class: 'btn-ghost', text: 'Back' });
    back.addEventListener('click', goBack);
    var copy = el('button', { class: 'btn-ghost', text: 'Copy summary' });
    var tag = el('span', { class: 'copied-tag' });
    copy.addEventListener('click', function () {
      var text = summaryPairs().map(function (p) { return p.label + ': ' + p.value; }).join('\n');
      function done() { tag.textContent = 'Copied'; setTimeout(function () { tag.textContent = ''; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
    var submitting = submitState === 'submitting';
    var submit = el('button', { class: 'btn-primary', text: submitting ? 'Sending…' : 'Send quote request' });
    if (submitting) submit.disabled = true;
    submit.addEventListener('click', function () {
      if (submitState === 'submitting') return;
      submitState = 'submitting';
      render();
      submitToNetlify().then(function () {
        submitState = 'success';
        pendingFocus = { heading: true };
        render();
      }).catch(function (err) {
        submitState = 'error';
        submitErrorMsg = (err && err.message) || '';
        pendingFocus = { selector: '.inline-error' };
        render();
      });
    });
    row.appendChild(back);
    row.appendChild(copy);
    row.appendChild(submit);
    card.appendChild(row);
    card.appendChild(tag);
    return card;
  }

  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) { /* clipboard unavailable */ }
  }

  function renderConfirm() {
    var card = el('div', { class: 'card confirm' });
    card.appendChild(el('div', { class: 'check-badge', text: '✓' }));
    card.appendChild(el('h2', { class: 'stage-title', text: 'Thanks — request sent' }));
    card.appendChild(el('p', { text: "I've got your details and will get back to you with a quote, usually within 24 hours. For anything urgent, call me on 0413 432 850." }));
    var again = el('button', { class: 'btn-ghost btn-full', text: 'Start another request' });
    again.style.marginTop = '20px';
    again.addEventListener('click', function () {
      answers = presetJob ? { jobType: presetJob } : {}; photoFiles = []; submitState = 'idle'; submitErrorMsg = ''; currentIndex = -1; pendingFocus = { heading: true }; render();
    });
    card.appendChild(again);
    return card;
  }

  function applyFocus() {
    if (!pendingFocus) return;
    var target = null;
    if (pendingFocus.option !== undefined) {
      target = stage.querySelectorAll('.option')[pendingFocus.option];
    } else if (pendingFocus.selector) {
      target = stage.querySelector(pendingFocus.selector);
    } else if (pendingFocus.heading) {
      target = stage.querySelector('h2');
      if (target) target.setAttribute('tabindex', '-1');
    }
    pendingFocus = null;
    if (target) target.focus();
  }

  function render() {
    renderStage();
    applyFocus();
  }

  function renderStage() {
    updateProgress();
    stage.innerHTML = '';
    var order = getStepOrder(answers);
    if (currentIndex === -1) { stage.appendChild(renderIntro()); return; }
    if (currentIndex >= order.length) {
      stage.appendChild(submitState === 'success' ? renderConfirm() : renderSummary());
      return;
    }
    var id = order[currentIndex];
    var def = stepDef(id);
    if (def.type === 'safety') stage.appendChild(renderSafety(id));
    else stage.appendChild(renderQuestion(id, def));
  }

  render();
})();

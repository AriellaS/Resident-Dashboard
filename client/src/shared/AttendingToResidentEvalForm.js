export const Pages = [{
    name: 'TYPE_SURGERY',
    text: 'Type of Surgery',
}, {
    name: 'PREPARATION',
    text: 'Preparation',
}, {
    name: 'INTRA_OP',
    text: 'Intra-operative feedback',
}, {
    name: 'ATTRIBUTES',
    text: 'Attributes',
}, {
    name: 'WRITTEN',
    text: 'Written Feedback',
}];

export const Questions = [{
        page: 'TYPE_SURGERY',
        name: 'SUBSPECIALTY',
        type: 'RADIO',
        questionText: 'Otolaryngology Subspecialty',
        optionTexts: ['Comprehensive','H & N / Microvascular','Rhinology','Facial Plastics','Laryngology','Otology','Pediatric']
    }, {
        page: 'TYPE_SURGERY',
        name: 'SURGERY',
        type: 'SHORT_TEXT',
        questionText: 'What type of surgery was performed?',
    }, {
        page: 'PREPARATION',
        name: 'BRIEFING',
        type: 'RADIO',
        questionText: 'How was the pre-operative briefing performed with the resident?',
        optionTexts: ['Text/phone call the day before surgery', 'Discussion the day of surgery', 'There was no pre-operative briefing'],
    }, {
        page: 'PREPARATION',
        name: 'PREP_RATING',
        type: 'RADIO',
        questionText: 'How would you rate the resident\'s preparation for the surgery?',
        optionTexts: ['5 (most prepared)','4','3','2','1 (most prepared)'],
    }, {
        page: 'PREPARATION',
        name: 'PREP_COMMENT',
        type: 'SHORT_TEXT',
        questionText: 'Please comment on the resident\'s preparation for the procedure',
    }, {
        page: 'INTRA_OP',
        name: 'GUIDANCE',
        type: 'RADIO',
        questionText: 'How much guidance did you provide for the majority of the critical portions of the case?',
        optionTexts: ['Show and tell','Active help','Passive help','Supervision only'],
    }, {
        page: 'INTRA_OP',
        name: 'PERFORMANCE',
        type: 'RADIO',
        questionText: 'What was the resident\'s performance for the majority of the critical portions of this case?',
        optionTexts: ['Unprepared/critical deficiency','Inexperienced with the procedure','Intermediate performance','Practice ready performance','Exceptional performance'],
    }, {
        page: 'INTRA_OP',
        name: 'COMPLEXITY',
        type: 'RADIO',
        questionText: 'How complex was the case relative to similar procedures?',
        optionTexts: ['Easiest 1/2','Average','Hardest 1/3'],
    }, {
        page: 'ATTRIBUTES',
        name: 'KNOWLEDGE',
        type: 'RADIO',
        questionText: 'Procedural Knowledge',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'OP_PLAN',
        type: 'RADIO',
        questionText: 'Operative Plan',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'APPROACH',
        type: 'RADIO',
        questionText: 'Incision/Approach',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'PLANES',
        type: 'RADIO',
        questionText: 'Tissue planes',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'HANDLING',
        type: 'RADIO',
        questionText: 'Tissue handling',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'BLEEDING',
        type: 'RADIO',
        questionText: 'Bleeding',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'NEED',
        type: 'RADIO',
        questionText: 'Need for direction',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'POSOTP_PLAN',
        type: 'RADIO',
        questionText: 'Postoperative plan',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'COMMUNICATION',
        type: 'RADIO',
        questionText: 'Communication',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'RESPONSIVENESS',
        type: 'RADIO',
        questionText: 'Responsiveness to feedback',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'RESPECT',
        type: 'RADIO',
        questionText: 'Respect for others',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'ATTRIBUTES',
        name: 'TEACHING',
        type: 'RADIO',
        questionText: 'Teaching',
        optionTexts: ['Needing attention','Developing','Achieving goals of PGY level'],
    }, {
        page: 'WRITTEN',
        name: 'MORE_OF',
        type: 'LONG_TEXT',
        questionText: 'What would you like this resident to do more of when operating with you?',
    }, {
        page: 'WRITTEN',
        name: 'LESS_OF',
        type: 'LONG_TEXT',
        questionText: 'What would you like this resident to do less of when operating with you?',
    }, {
        page: 'WRITTEN',
        name: 'GENERAL',
        type: 'LONG_TEXT',
        questionText: 'Generalized Feedback',
    }
];

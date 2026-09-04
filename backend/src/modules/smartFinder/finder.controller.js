const Service = require(
  "../serviceDirectory/service.model"
);


// ======================================
// CATEGORY KEYWORDS
// ======================================

const categoryKeywords = {
  Identification: [
    "nic",
    "identity",
    "identity card",
    "national identity card",
    "passport",
    "birth certificate",
    "certificate",
    "lost nic",
    "replace nic",
    "replacement",
  ],

  Transport: [
    "driving",
    "driving licence",
    "driving license",
    "licence",
    "license",
    "vehicle",
    "motor",
    "traffic",
    "transport",
  ],

  Education: [
    "education",
    "school",
    "student",
    "university",
    "bursary",
    "scholarship",
    "course",
    "study",
  ],

  Health: [
    "health",
    "hospital",
    "medical",
    "clinic",
    "doctor",
    "medicine",
  ],

  Business: [
    "business",
    "company",
    "register business",
    "business registration",
    "business name",
    "trade",
    "entrepreneur",
  ],

  "Social Services": [
    "social",
    "welfare",
    "allowance",
    "assistance",
    "support",
    "elderly",
    "disability",
  ],

  "Land & Property": [
    "land",
    "property",
    "deed",
    "ownership",
    "house",
    "title",
  ],
};


// ======================================
// STOP WORDS
// ======================================

const stopWords = new Set([
  "i",
  "me",
  "my",
  "we",
  "our",
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "for",
  "of",
  "in",
  "on",
  "at",
  "is",
  "are",
  "am",
  "be",
  "need",
  "want",
  "would",
  "like",
  "please",
  "help",
  "with",
  "how",
  "can",
  "do",
  "get",
]);


// ======================================
// NORMALIZE TEXT
// ======================================

const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};


// ======================================
// GET IMPORTANT WORDS
// ======================================

const getImportantWords = (text) => {
  return normalizeText(text)
    .split(" ")
    .filter(
      (word) =>
        word.length > 2 &&
        !stopWords.has(word)
    );
};


// ======================================
// DETECT CATEGORY
// ======================================

const detectCategory = (userText) => {
  const text =
    normalizeText(userText);

  let bestCategory = null;

  let highestScore = 0;


  Object.entries(
    categoryKeywords
  ).forEach(
    ([category, keywords]) => {
      let score = 0;


      keywords.forEach(
        (keyword) => {
          if (
            text.includes(
              normalizeText(keyword)
            )
          ) {
            score += 1;
          }
        }
      );


      if (
        score > highestScore
      ) {
        highestScore = score;

        bestCategory =
          category;
      }
    }
  );


  return bestCategory;
};


// ======================================
// SCORE ONE SERVICE
// ======================================

const calculateServiceScore = (
  service,
  userText,
  selectedCategory,
  detectedCategory
) => {
  let score = 0;

  const reasons = [];


  const words =
    getImportantWords(
      userText
    );


  const name =
    normalizeText(
      service.name
    );

  const description =
    normalizeText(
      service.description
    );

  const department =
    normalizeText(
      service.department
    );

  const eligibility =
    normalizeText(
      service.eligibility
    );

  const documents =
    normalizeText(
      (
        service.requiredDocuments ||
        []
      ).join(" ")
    );


  // ====================================
  // SELECTED CATEGORY MATCH
  // ====================================

  if (
    selectedCategory &&
    selectedCategory !==
      "Not Sure" &&
    service.category ===
      selectedCategory
  ) {
    score += 10;

    reasons.push(
      `Matches your selected ${selectedCategory} category`
    );
  }


  // ====================================
  // AUTOMATIC CATEGORY MATCH
  // ====================================

  if (
    detectedCategory &&
    service.category ===
      detectedCategory
  ) {
    score += 7;

    if (
      !reasons.some(
        (reason) =>
          reason.includes(
            "category"
          )
      )
    ) {
      reasons.push(
        `Your description appears related to ${detectedCategory}`
      );
    }
  }


  // ====================================
  // WORD MATCHING
  // ====================================

  let nameMatches = 0;

  let descriptionMatches =
    0;

  let documentMatches =
    0;


  words.forEach((word) => {
    if (
      name.includes(word)
    ) {
      score += 5;

      nameMatches += 1;
    }


    if (
      description.includes(
        word
      )
    ) {
      score += 3;

      descriptionMatches += 1;
    }


    if (
      department.includes(
        word
      )
    ) {
      score += 2;
    }


    if (
      eligibility.includes(
        word
      )
    ) {
      score += 1;
    }


    if (
      documents.includes(
        word
      )
    ) {
      score += 2;

      documentMatches += 1;
    }
  });


  if (
    nameMatches > 0
  ) {
    reasons.push(
      "Service name matches your request"
    );
  }


  if (
    descriptionMatches > 0
  ) {
    reasons.push(
      "Service description is related to your need"
    );
  }


  if (
    documentMatches > 0
  ) {
    reasons.push(
      "Related required documents were identified"
    );
  }


  return {
    score,
    reasons,
  };
};


// ======================================
// GET RECOMMENDATIONS
// ======================================

const getRecommendations =
  async (req, res) => {
    try {
      const {
        needDescription,
        category,
      } = req.body;


      // ==================================
      // VALIDATION
      // ==================================

      if (
        !needDescription ||
        needDescription
          .trim()
          .length < 3
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please describe the government service or assistance you need.",
          });
      }


      // ==================================
      // LOAD SERVICES
      // ==================================

      const services =
        await Service.find({}).lean();


      if (
        services.length === 0
      ) {
        return res
          .status(200)
          .json({
            success: true,

            count: 0,

            detectedCategory:
              null,

            message:
              "No government services are currently available in the directory.",

            data: [],
          });
      }


      // ==================================
      // DETECT CATEGORY
      // ==================================

      const detectedCategory =
        detectCategory(
          needDescription
        );


      // ==================================
      // SCORE SERVICES
      // ==================================

      const scoredServices =
        services.map(
          (service) => {
            const result =
              calculateServiceScore(
                service,
                needDescription,
                category,
                detectedCategory
              );


            return {
              ...service,

              smartScore:
                result.score,

              matchReasons:
                result.reasons,
            };
          }
        );


      // ==================================
      // ONLY KEEP MATCHES
      // ==================================

      let recommendations =
        scoredServices
          .filter(
            (service) =>
              service.smartScore >
              0
          )
          .sort(
            (a, b) =>
              b.smartScore -
              a.smartScore
          )
          .slice(0, 3);


      // ==================================
      // CATEGORY FALLBACK
      // ==================================

      if (
        recommendations.length ===
          0 &&
        category &&
        category !==
          "Not Sure"
      ) {
        recommendations =
          scoredServices
            .filter(
              (service) =>
                service.category ===
                category
            )
            .slice(0, 3);
      }


      // ==================================
      // CREATE FRIENDLY MATCH SCORE
      // ==================================

      recommendations =
        recommendations.map(
          (service) => {
            let matchLevel =
              "Possible Match";


            if (
              service.smartScore >=
              15
            ) {
              matchLevel =
                "Strong Match";
            } else if (
              service.smartScore >=
              8
            ) {
              matchLevel =
                "Good Match";
            }


            return {
              ...service,

              matchLevel,

              matchReasons:
                service
                  .matchReasons
                  .slice(0, 3),
            };
          }
        );


      // ==================================
      // RESPONSE
      // ==================================

      res.status(200).json({
        success: true,

        count:
          recommendations.length,

        detectedCategory,

        message:
          recommendations.length >
          0
            ? "We found services that may match your needs."
            : "We could not find a close match. Try adding more details or selecting a category.",

        data:
          recommendations,
      });
    } catch (error) {
      console.error(
        "Smart Finder Error:",
        error
      );


      res.status(500).json({
        success: false,

        message:
          "Unable to find service recommendations. Please try again.",
      });
    }
  };


module.exports = {
  getRecommendations,
};
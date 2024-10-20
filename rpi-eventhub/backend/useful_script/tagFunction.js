const json = {
    fun: ["trivia", "games", "karaoke", "arcade", "party", "parties", "fun", "enjoyment", "entertainment"],
    games: ["chess", "uno", "monopoly", "scrabble", "catan", "risk", "pandemic", "clue", "codenames", "ticket to ride", "pictionary", "carcassonne"],
    board_game: ["chess", "uno", "monopoly", "scrabble", "catan", "risk", "pandemic", "clue", "codenames", "ticket to ride", "pictionary", "carcassonne"],
    food: ["pizza", "pasta", "burger", "sushi", "bbq", "wings", "lobster", "seafood", "brunch", "dinner", "lunch", "breakfast", "dessert", "buffet", "food", "snacks", "beverages", "cocktails"],
    social: ["social", "gathering", "performance", "party", "festival", "hangout", "friends", "community", "celebration", "meetup", "collaboration", "trivia", "rush", "networking"],
    competitive: ["tournament", "competition", "competitor", "match", "league", "championship", "contest", "race", "qualifier", "elimination", "showdown", "battle"],
    competition: ["tournament", "competition", "competitor", "match", "league", "championship", "contest", "race", "qualifier", "elimination", "showdown", "battle"],
    movie: ["action", "thriller", "drama", "comedy", "sci-fi", "romance", "animated", "documentary", "horror", "classic", "superhero", "indie", "blockbuster", "biopic", "musical", "film", "movie", "showing", "now showing", "screening", "premiere"],
    anime: ["anime", "naruto", "demon slayer", "jujutsu kaisen", "attack on titan", "one piece", "my hero academia", "bleach", "dragon ball", "fullmetal alchemist"],
    academic: ["academic", "lecture", "seminar", "research", "thesis", "study", "homework", "presentation", "project", "test", "exam", "scholarship", "internship", "course", "workshop", "textbook", "coding", "education", "class", "tutorial"],
    professional: ["professional", "career", "resume", "job interview", "internship", "mentorship", "skills", "leadership", "communication", "time management", "networking", "teamwork", "job fair", "work", "business", "development"],
    career: ["professional", "career", "resume", "job interview", "internship", "mentorship", "skills", "leadership", "communication", "time management", "networking", "teamwork", "job fair", "work", "business", "development"],
    relax: ["relax", "meditation", "spa", "yoga", "massage", "beach", "nap", "reading", "journaling", "deep breathing", "relaxation", "nature walk", "tea", "sunset", "self-care", "calm", "tranquility"],
    outdoor: ["outdoor", "hiking", "camping", "picnic", "cycling", "rock climbing", "fishing", "bird watching", "stargazing", "kayak", "trail", "beach", "bonfire", "nature", "gardening", "kayaking"],
    workshop: ["workshop", "coding", "photography", "crafting", "painting", "writing", "public speaking", "business", "design", "acting", "culinary", "music", "leadership", "technical skills", "innovation", "hands-on", "training"],
    fundraiser: ["fundraiser", "charity", "donation", "auction", "walkathon", "crowdfunding", "benefit", "campaign", "awareness", "nonprofit", "giving", "support", "philanthropy"],
    art: ["art", "painting", "sculpture", "photography", "design", "gallery", "installation", "performance", "abstract", "fine art", "street art", "canvas", "portrait", "digital art", "illustration", "craft", "artistic", "creative"],
    music: ["music", "concert", "dj", "orchestra", "festival", "band", "choir", "instrumental", "DJ", "live performance", "pop", "rock", "classical", "jazz", "hip hop", "electronic", "folk", "musician", "gig", "performance"],
    sports: ["sport", "sports", "basketball", "soccer", "tennis", "swimming", "running", "volleyball", "hiking", "skiing", "golf", "cycling", "gymnastics", "baseball", "football", "track and field", "yoga", "rowing", "athletics", "competition"],
    creative: ["creative", "innovation", "imagination", "inspiration", "original", "visionary", "artistic", "design", "crafting", "writing", "creative thinking", "brainstorming", "ideation"],
    tech: ["technology", "tech", "code", "coding", "AI", "machine learning", "web development", "cybersecurity", "blockchain", "data science", "cloud computing", "robotics", "automation", "virtual reality", "hackathon", "software", "programming", "networking", "devops", "big data"],
    wellness: ["wellness", "mental health", "fitness", "meditation", "self-care", "nutrition", "therapy", "stress relief", "work-life balance", "exercise", "sleep", "mindfulness", "well-being", "diet", "relaxation", "yoga", "health", "holistic", "rejuvenation"],
    coding: ["coding", "programming", "software development", "web development", "app development", "javascript", "python", "java", "c++", "html", "css", "react", "node.js", "full-stack", "backend", "frontend", "development"]
}

function giveTags(title, description) {
    var tags = [];
    
    // Ensure title and description are strings
    title = (title || '').toLowerCase();
    description = (description || '').toLowerCase();
  
    // Remove punctuation
    title = title.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_{|}~]/g, '');
    description = description.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_{|}~]/g, '');
  
    var titleParsed = title.split(" ");
    var descriptParsed = description.split(" ");
  
    var wordsArray = titleParsed.concat(descriptParsed);
  
    for (var i = 0; i < wordsArray.length; i++) {
      var curr = wordsArray[i];
      for (const key in json) {
        if (json[key].includes(curr)) {
          tags.push(key);
        }
      }
    }
    
    return new Set(tags);
  }
  
module.exports = {
    giveTags,
};
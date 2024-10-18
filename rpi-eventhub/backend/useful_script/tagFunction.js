const json = {
    fun: ["trivia", "games", "karaoke", "arcade", "party", "parties"],
    food: ["pizza", "pasta", "burger", "sushi", "bbq", "wings", "lobster", "seafood", "brunch", "dinner", "lunch", "breakfast", "dessert", "buffet", "food"],
    social: ["social", "gathering", "performance", "party", "festival", "hangout", "friends", "community", "celebration", "meetup", "collaboration", "trivia", "rush"],
    movie: ["action", "thriller", "drama", "comedy", "sci-fi", "romance", "animated", "documentary", "horror", "classic", "superhero", "indie", "blockbuster", "biopic", "musical", "film", "movie"],
    anime: ["anime", "naruto", "demon slayer", "jujutsu kaisen"],
    academic: ["academic", "lecture", "seminar", "research", "thesis", "study", "homework", "presentation", "project", "test", "exam", "scholarship", "internship", "course", "workshop", "textbook", "coding"],
    professional: ["professional", "career", "resume", "job interview", "internship", "mentorship", "skills", "leadership", "communication", "time management", "networking", "teamwork", "job fair", "work"],
    relax: ["relax", "meditation", "spa", "yoga", "massage", "beach", "nap", "reading", "journaling", "deep breathing", "relaxation", "nature walk", "tea", "sunset", "self-care"],
    outdoor: ["outdoor", "hiking", "camping", "picnic", "cycling", "rock climbing", "fishing", "bird watching", "stargazing", "kayak", "trail", "beach", "bonfire", "nature"],
    workshop: ["workshop", "coding", "photography", "crafting", "painting", "writing", "public speaking", "business", "design", "acting", "culinary", "music", "leadership", "technical skills", "innovation"],
    fundraiser: ["fundraiser", "charity", "donation", "auction", "walkathon", "crowdfunding", "benefit", "campaign", "awareness", "nonprofit"],
    art: ["art", "painting", "sculpture", "photography", "design", "gallery", "installation", "performance", "abstract", "fine art", "street art", "canvas", "portrait", "digital art", "illustration", "craft"],
    music: ["music", "concert", "dj", "orchestra", "festival", "band", "choir", "instrumental", "DJ", "live performance", "pop", "rock", "classical", "jazz", "hip hop", "electronic", "folk"],
    sports: ["sport", "sports", "basketball", "soccer", "tennis", "swimming", "running", "volleyball", "hiking", "skiing", "golf", "cycling", "gymnastics", "baseball", "football", "track and field", "yoga", "rowing"],
    tech: ["technology", "tech", "code", "coding", "AI", "machine learning", "web development", "cybersecurity", "blockchain", "data science", "cloud computing", "robotics", "automation", "virtual reality", "hackathon", "software", "programming", "networking"],
    wellness: ["wellness", "mental health", "fitness", "meditation", "self-care", "nutrition", "therapy", "stress relief", "work-life balance", "exercise", "sleep", "mindfulness", "well-being", "diet", "relaxation", "yoga"],
}

function giveTags(title, description){
    var tags = [];
    title = title.toLowerCase();
    description = description.toLowerCase();

    title = title.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
    description = description.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');

    var titleParsed = title.split(" ");
    var descriptParsed = description.split(" ");

    var wordsArray = titleParsed.concat(descriptParsed);

    for(var i = 0; i < wordsArray.length; i++){
        var curr = wordsArray[i];
        for(const key in json){
            if(json[key].includes(curr)){
                tags.push(key);
            }
        }
    }
    return new Set(tags);
}
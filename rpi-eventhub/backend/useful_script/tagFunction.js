const json = {
    fun: [],
    food: ["pizza", "pasta", "burger", "sushi", "bbq", "seafood", "brunch", "dinner", "lunch", "dessert", "buffet", "food"],
    social: ["gathering", "party", "festival", "hangout", "friends", "community", "celebration", "meetup", "collaboration", "icebreaker"],
    movie: ["action", "thriller", "drama", "comedy", "sci-fi", "romance", "animated", "documentary", "horror", "classic", "superhero", "indie", "blockbuster", "biopic", "musical", "film", "movie"],
    anime: [],
    academic: ["lecture", "seminar", "research", "thesis", "study", "homework", "presentation", "project", "test", "exam", "scholarship", "internship", "course", "workshop", "textbook"],
    professional: ["career", "resume", "job interview", "internship", "mentorship", "skills", "leadership", "communication", "time management", "networking", "teamwork", "job fair", "work"],
    relax: ["meditation", "spa", "yoga", "massage", "beach", "nap", "reading", "journaling", "deep breathing", "bubble bath", "relaxation", "nature walk", "tea", "sunset", "self-care"],
    outdoor: ["hiking", "camping", "picnic", "cycling", "rock climbing", "fishing", "bird watching", "stargazing", "kayaking", "trail running", "beach", "barbecue", "bonfire", "nature walk", "outdoor games"],
    workshop: ["coding", "photography", "crafting", "painting", "writing", "public speaking", "business", "design", "acting", "culinary", "art", "music", "leadership", "technical skills", "innovation"],
    fundraiser: ["fundraiser", "charity", "donation", "volunteer", "gala", "auction", "event", "walkathon", "crowdfunding", "benefit", "campaign", "community", "awareness", "raffle", "nonprofit", "philanthropy"],
    art: ["painting", "sculpture", "photography", "design", "gallery", "installation", "performance", "abstract", "fine art", "street art", "canvas", "portrait", "digital art", "illustration", "craft"],
    music: ["concert", "orchestra", "festival", "band", "choir", "instrumental", "DJ", "live performance", "pop", "rock", "classical", "jazz", "hip hop", "electronic", "folk"],
    sports: ["basketball", "soccer", "tennis", "swimming", "running", "volleyball", "hiking", "skiing", "golf", "cycling", "gymnastics", "baseball", "football", "track and field", "yoga", "rowing"],
    tech: ["coding", "AI", "machine learning", "web development", "cybersecurity", "blockchain", "data science", "cloud computing", "robotics", "automation", "virtual reality", "augmented reality", "software", "programming", "networking"],
    wellness: ["mental health", "fitness", "meditation", "self-care", "nutrition", "therapy", "stress relief", "work-life balance", "exercise", "sleep", "mindfulness", "well-being", "diet", "relaxation", "yoga"],
}

function giveTags(title, description){
    var tags = [];
    title = title.toLowerCase();
    description = title.toLowerCase();

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
    return tags;
}

var tags = giveTags("Pizza Party", "We will serve pizza and study");
console.log(tags);

tags.forEach(function(tag) {
    console.log(tag);
});
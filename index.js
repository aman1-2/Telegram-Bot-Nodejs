const {Telegraf} = require('telegraf'); /*This is an Import statement for telegraf package
which are going to use for creating a telegram bot.
This telegraf package -> Automatically handles the telegram API calls making our life easier
to code and make a telegram bot.*/
require('dotenv').config(); //For loading our env.config file in the proccess.
const axios = require('axios'); //For making an Http call.

/*When working with Telegraf, ctx.session is an object that allows you to store data related
to the current user's session. This data persists throughout the conversation with the bot 
until the session ends.
This allows you to retrieve and utilize the user's date of birth later, without the need for 
external storage mechanisms like databases.*/
const LocalSession = require('telegraf-session-local');

/*
Steps how to get the sceret token for creating a bot??
-> Open telegram and search for botfather.
-> To read instructions type /start and press enter.
-> To create a new bot type /newbot and press enter.
-> It will ask for a bot name, give a bot name without a slash. E.g:coding
-> Then it will ask for a username ending with the bot. E.g:coding_bot
https://t.me/CodeCrest_bot
*/

const bot =new Telegraf(process.env.BOT_TOKEN);
/*The use case of token is simple to identify who the user is who made this bot.*/

// Setup local session middleware
const localSession = new LocalSession({
    database: 'local.db', // The name of the file to save data
    storage: LocalSession.storageFileAsync, // Use file storage for session data
    format: {
        serialize: (obj) => JSON.stringify(obj, null, 2), // Custom serialization function
        deserialize: (str) => JSON.parse(str), // Custom deserialization function
    },
});

// Enable session support
bot.use(localSession.middleware());

bot.start((ctx) => (ctx.reply("A warm 🙏 welcome to the Coding Bot by CodeCrest.")));

let binarySearchcpp  = `
#include<iostream>
using namespace std;
int searching(int arr[],int num,int search); //Searching Function
int main(){
    int num,count=0,search;
    cout<<"Enter the number: ";
    cin>>num;
    int arr[num];
    for(int &ele:arr){
        cout<<"Enter the "<<count++<<" element: ";
        cin>>ele;
    }
    cout<<endl;
    cout<<"Enter the element which you want to search from the array: ";
    cin>>search;
    cout<<endl;
    int res=searching(arr,num,search);
    if(res==-1) cout<<"The element you are searching in the array is not present in it.";
    else    cout<<"The index of the "<<search<<" in array is: "<<res;
    return 0;
}
int searching(int arr[],int num,int search){
    int starting=0,ending=num-1;//Defining the Searching space from where till where 
    // we have to search the element.
    while(starting<=ending){
        //Calculating the mid point of the data set(i.e array).
        int mid=(starting+ending)/2;
        if(arr[mid]==search)    return mid; //If equal then return the index.
        else if(arr[mid]<search)    starting=mid+1; //Discard the left of the mid.
        else    ending=mid-1; //Discard the right of the mid. 
    }
    return -1; //-1 is returned if we haven't found the searched element from our search space.
}
`;
//For this command we have tried to store a hard core value but lets say you want to fetch 
//the data from internet then you can simple make a API call for it.
bot.command('binarysearchcpp', (ctx) => (ctx.reply(binarySearchcpp)));

bot.on('sticker', (ctx) => (ctx.reply('👍')));

//This is to demonstrate how actually we can fetch a data from internet for our bot.
bot.command('mergesort', async function(ctx){
    const response = await axios.get("https://raw.githubusercontent.com/aman1-2/Cpp-Program-Files/main/Sorting%20Algorithms/13_merge_sort.cpp");
    return ctx.reply(response.data);
});

//All of this start, command, on -> these are the events when ever any of this event hits our bots starts replying for it.
//These event listeners are already configred inside our telegraf package.


// Function to send birthday reminders
function sendBirthdayReminders() {
    bot.telegram.getUpdates().then((updates) => {
        updates.forEach((update) => {
            const chatId = update.message.chat.id;
            const dob = update.message.text;

            // Check if message is a date in the format YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
                const today = new Date();
                const nextBirthday = new Date(today.getFullYear(), new Date(dob).getMonth(), new Date(dob).getDate());
                if (today > nextBirthday) {
                    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                }
                const diffTime = Math.abs(nextBirthday - today);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) {
                    bot.telegram.sendMessage(chatId, 'Your next birthday is in ' + diffDays + ' days!');
                }
            }
        });
    });
}

// Schedule reminders to be sent every 24 hours
setInterval(sendBirthdayReminders, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

// Set Date of Birth command
bot.command('setdob', (ctx) => {
    ctx.reply('Please send me your date of birth in the format YYYY-MM-DD');
});

// Handling user's date of birth
bot.hears(/^\d{4}-\d{2}-\d{2}$/, (ctx) => {
    const dob = ctx.message.text;
    ctx.session.dob = dob;
    ctx.reply('Your date of birth is set to ' + dob + '.');
});

// Check for reminders
bot.command('remind', (ctx) => {
    const dob = ctx.session.dob;
    if (dob) {
        const today = new Date();
        const nextBirthday = new Date(today.getFullYear(), new Date(dob).getMonth(), new Date(dob).getDate());
        if (today > nextBirthday) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        const diffTime = Math.abs(nextBirthday - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        ctx.reply('Your next birthday is in ' + diffDays + ' days.');
    } else {
        ctx.reply('Please set your date of birth first using /setdob command.');
    }
});




// Object to store user notes/todo lists
const userNotes = {};

// Add command
bot.command('add', (ctx) => {
    const task = ctx.message.text.replace('/add ', '');
    const userId = ctx.from.id;

    // Add the task to user's list
    if (!userNotes[userId]) {
        userNotes[userId] = [task];
    } else {
        userNotes[userId].push(task);
    }

    ctx.reply('Task added successfully!');
});

// List command
bot.command('list', (ctx) => {
    const userId = ctx.from.id;

    // Check if the user has any tasks
    if (!userNotes[userId] || userNotes[userId].length === 0) {
        ctx.reply('You have no tasks!');
    } else {
        const tasks = userNotes[userId].join('\n');
        ctx.reply('Your tasks:\n' + tasks);
    }
});

// Reminder function
function sendReminders() {
    Object.keys(userNotes).forEach((userId) => {
        const tasks = userNotes[userId];
        if (tasks && tasks.length > 0) {
            bot.telegram.sendMessage(userId, 'Here are your pending tasks:\n' + tasks.join('\n'));
        }
    });
}

// Send reminders every hour
setInterval(sendReminders, 3600000); // 3600000 milliseconds = 1 hour

bot.launch() //This eventually helps to launch our bot whenever the programming is runnig.
const {Telegraf} = require('telegraf'); /*This is an Import statement for telegraf package
which are going to use for creating a telegram bot.
This telegraf package -> Automatically handles the telegram API calls making our life easier
to code and make a telegram bot.*/
require('dotenv').config(); //For loading our env.config file in the proccess.
const axios = require('axios'); //For making an Http call.

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

bot.launch() //This eventually helps to launch our bot whenever the programming is runnig.
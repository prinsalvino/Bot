const search = require('yt-search');
exports.run = (client, message, args, ops) => {
    //Search
    search(args.join(' '), function(err, res) => {
        //Error Handling
        if (err) return message.channe; {
            
        }
    });
}
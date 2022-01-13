const mongoose = require('mongoose');
const bycrypt =  require('bcrypt');
const { promise } = require('bcrypt/promises');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    bycrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err);
        }

        bycrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });

    });
});

userSchema.methods.comparePassword = function(candidatepassword){
    const user = this;

    return new Promise((resolve,reject)=>{
        bycrypt.compare(candidatepassword,user.password,(err,isMatch) => {
            if(err){
                return reject(err);
            }
            if(!isMatch){
                return reject(false);
            }
            resolve(true);
        });
    });
};

mongoose.model('User',userSchema);
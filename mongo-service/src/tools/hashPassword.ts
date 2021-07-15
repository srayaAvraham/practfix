import * as bcrypt from 'bcryptjs';
const saltRounds = 10;

const encryptPassword = async (password:string): Promise<string> => {
  	try {
  		const hash: string = await bcrypt.hashSync(password, saltRounds);
  	  	return hash;
  	} catch (error: any) {
  	  	throw Error(error.message);
  	}

};

const comparePassword = async (password: string, passwordHash: string): Promise<Boolean> => {
	try {
		const match: Boolean = await bcrypt.compare(password, passwordHash);
		return match;
	} catch (error: any) {
		  throw Error(error.message);
	}

};

export {
	encryptPassword,
	comparePassword,
}
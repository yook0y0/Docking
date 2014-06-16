package analysis.tokenizer;

import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;

public class CharacterTokenizer extends Tokenizer {
	
	private char[] buffer = new char[8 * 1024];
	private char[] token;
	
	public CharacterTokenizer(String in, char[] token) {
		this(new StringReader(in), token);
	}
	
	public CharacterTokenizer(Reader in, char[] token) {
		super(in);
		this.token = token;
		// TODO Auto-generated constructor stub
	}
	
	public char[] getBuffer() {
		return buffer;
	}

	public void setBuffer(char[] cBuffer) {
		this.buffer = cBuffer;
	}
	
	public char[] getToken() {
		return token;
	}

	public void setToken(char[] token) {
		this.token = token;
	}
	
	@Override
	public void analyze() throws IOException, InstantiationException, IllegalAccessException{
		
		DataAttribute dAttr = (DataAttribute) this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);
		
		if(dAttr != null){
			Reader in = super.getIn();
			
			int written = 0;
			char c = ' ';
			String dat = "";
			List<String> arr = new ArrayList<String>();

			while((written = in.read(buffer)) >= 0)
			{
				for(int i=0;i<written;i++)
				{
					c = buffer[i];
					for(char t : this.token){
						if(c == t || i==written-1){
							if(i == written-1){dat += c;}
							arr.add(dat);
							dat = "";
						}
						else{
							dat += c;
						}
					}
				}
			}
			
			int size = arr.size();
			byte[][] type = new byte[size][];
			byte[][] data = new byte[size][];
			for(int i=0;i<size;i++){
				type[i] = "token".getBytes();
				data[i] = arr.get(i).getBytes();
			}
			
			dAttr.setProcess(Attr.PROCESS_TOKENIZER);
			dAttr.setType(type);
			dAttr.setData(data);
			
			this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
		}
		else{
			// Error message..
		}
	}
}

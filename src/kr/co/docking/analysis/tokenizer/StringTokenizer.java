package kr.co.docking.analysis.tokenizer;

import java.io.BufferedReader;
import java.io.Reader;
import java.io.StringReader;

import kr.co.docking.analysis.attribute.Attr;
import kr.co.docking.analysis.attribute.DataAttribute;

public class StringTokenizer extends Tokenizer {

	private String[] token;

	public StringTokenizer(String in,String[] token) {
		this(new StringReader(in),token);
	}

	public StringTokenizer(Reader in,String[] token) {
		super(in);
		this.token = token;
		// TODO Auto-generated constructor stub
	}

	public String[] getToken() {
		return token;
	}

	public void setToken(String[] token) {
		this.token = token;
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		DataAttribute dAttr = (DataAttribute) this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){
			BufferedReader br = new BufferedReader(this.getIn());

			String read = null;
			String tmp = "";
			while((read = br.readLine()) != null){
				tmp += read;
			}

			String[] dataTmp = null;
			for(int i=0;i<this.token.length;i++/*String s : this.token*/){
				dataTmp = tmp.split(this.token[i]);
				tmp = "";
				if(i == this.token.length-1){
					break;
				}
				else{
					for(String ss : dataTmp){
						tmp += ss;
					}
				}
			}

			int size = dataTmp.length;
			byte[][] type = new byte[size][];
			byte[][] data = new byte[size][];
			for(int i=0;i<size;i++){
				type[i] = "token".getBytes();
				data[i] = dataTmp[i].getBytes();
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

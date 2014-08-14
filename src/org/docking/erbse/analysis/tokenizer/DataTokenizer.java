package org.docking.erbse.analysis.tokenizer;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;
import org.docking.erbse.analysis.attribute.TokenAttribute;

public class DataTokenizer extends Tokenizer {

	public DataTokenizer(DockingAnalyzer stream, byte[] token) {
		super(stream, token);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze(){
		DataAttribute dAttr = null;
		dAttr = (DataAttribute)this.getAttrSet().get(Attr.DATA_ATTR);

		TokenAttribute tAttr = new TokenAttribute();
		super.addAttr(Attr.TOKEN_ATTR, tAttr);

		IndexAttribute iAttr = new IndexAttribute();
		super.addAttr(Attr.INDEX_ATTR, iAttr);

		List<Integer> startWidth = new ArrayList<Integer>();
		List<Integer> endWidth = new ArrayList<Integer>();

		List<byte[][]> tokenRes = new ArrayList<byte[][]>();

		int[][] startIndex = null;
		int[][] endIndex = null;
		byte[][][] tokenData = null;

		if(dAttr != null){			
			byte[][] data = dAttr.getData();
			
			tokenData = new byte[data.length][][];
			startIndex = new int[data.length][];
			endIndex = new int[data.length][];

			for(int i=0;i<data.length;i++){
				tokenData[i] = this.tokenize(data[i],startWidth,endWidth);
				startIndex[i] = new int[startWidth.size()];
				endIndex[i] = new int[startWidth.size()];
				
				for(int j=0;j<startWidth.size();j++){
					startIndex[i][j] = startWidth.get(j).intValue();
					endIndex[i][j] = endWidth.get(j).intValue();
				}
				startWidth.clear();
				endWidth.clear();
			}
			
			tAttr.setData(tokenData);
			super.modifyAttr(Attr.TOKEN_ATTR, tAttr);

			dAttr.setProcess(Attr.PROCESS_FILTER);
			super.modifyAttr(Attr.DATA_ATTR, dAttr);
			
			iAttr.setStartWidth(startIndex);
			iAttr.setEndWidth(endIndex);
			iAttr.setProcess(Attr.PROCESS_FILTER);
			super.modifyAttr(Attr.INDEX_ATTR, iAttr);
		}
		else{
			// Error Message..
		}
	}

	public byte[][] tokenize(byte[] data, List<Integer> startWidth, List<Integer> endWidth){
		byte[] token = super.getToken();
		
		List<byte[]> tokenList = new ArrayList<byte[]>();
		
		byte[] preData = null;
		byte[][] tokenData = null;
		
		int chk = 0;
		int preNum = 0;
		for(int i=0;i<data.length;i++){
			for(int j=0;j<token.length;j++){
				if(data[i] == token[0]){
					for(int k=0;k<token.length;k++){
						if(token[k] == data[i+k]){
							chk++;
						}
						else{
							break;
						}
					}
					if(chk == token.length){
						preData = new byte[preNum+i];
						System.arraycopy(data, preNum, preData, 0, preNum+i);
						
						tokenList.add(preData);

						startWidth.add(i);
						preNum = i+chk;
						i += chk;
						endWidth.add(i);
					}
				}
			}
			if(i == data.length-1){
				preData = new byte[preNum+i];
				System.arraycopy(data ,preNum ,preData ,0 ,data.length-preNum);
				tokenList.add(preData);
			}
		}
		
		tokenData = new byte[tokenList.size()][];
		tokenData = tokenList.toArray(tokenData);
		
		return tokenData;
	}
}
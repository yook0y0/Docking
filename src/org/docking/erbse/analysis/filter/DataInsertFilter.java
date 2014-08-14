package org.docking.erbse.analysis.filter;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DataInsertFilter extends DataProcessFilter {
	
	private byte[][] insertData;

	public DataInsertFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData, byte[][] insertData) {
		super(stream,preData,postData);
		this.insertData = insertData;
	}
	
	public byte[][] getInsertData() {
		return insertData;
	}

	public void setInsertData(byte[][] insertData) {
		this.insertData = insertData;
	}
	
	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth, List<Integer> endWidth) {
		int chk = 0;
		int sChk = 0;

		byte[] dataArr = data;
		byte[] bArr = dataArr;

		for(int i=0;i<dataArr.length;i++){

			for(int j=0;j<super.getPreData().length;j++){
				if(dataArr[i] == super.getPreData()[j][0]){
					for(int k=0;k<super.getPreData()[j].length;k++){
						if(dataArr[i+k] != super.getPreData()[j][k]){
							break;
						}
						else{
							chk++;
						}
					}
					if(chk == super.getPreData()[j].length){
						if(dataArr[i+chk] == super.getPostData()[j][0]){
							sChk = 0;
							for(int k=0;k<super.getPostData()[j].length;k++){
								if(dataArr[i+chk+k] == super.getPostData()[j][k]){
									sChk++;
								}
								else{
									break;
								}
							}
							if(sChk == super.getPostData()[j].length){
								
								bArr = new byte[dataArr.length+this.insertData[j].length];

								System.arraycopy(dataArr, 0, bArr, 0, i+super.getPreData()[j].length);
								System.arraycopy(this.insertData[j], 0, bArr, i+super.getPreData()[j].length, this.insertData[j].length);
								System.arraycopy(dataArr, i+super.getPreData()[j].length, bArr, i+super.getPreData()[j].length+this.insertData[j].length, dataArr.length-(i+super.getPreData()[j].length));

								startWidth.add(i);
								endWidth.add(i+super.getPreData()[j].length);
							}
						}
					}
					dataArr = bArr;
					chk = 0;
				}
			}
		}
		return dataArr;
	}
}

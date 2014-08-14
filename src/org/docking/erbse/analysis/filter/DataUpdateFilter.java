package org.docking.erbse.analysis.filter;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;

public class DataUpdateFilter extends DataProcessFilter {

	private byte[][] updateData;

	public DataUpdateFilter(DockingAnalyzer stream, byte[][] preData, byte[][] postData, byte[][] updateData) {
		super(stream,preData,postData);
		this.updateData = updateData;
	}

	public byte[][] getupdateData() {
		return updateData;
	}

	public void setupdateData(byte[][] updateData) {
		this.updateData = updateData;
	}

	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth, List<Integer> endWidth) {
		int chk = 0;
		int sChk = 0;
		int len = 0;

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
						/*
						 *  i+chk 는 시작부터 preData까지의 길이
						 *	i는 preData 전까지의 길이
						 */
						len=0;
						for(int k=i+chk;k<dataArr.length;k++,len++){
							System.out.println("k : " + k);
							System.out.println("dataArr.length : " + dataArr.length);
							/*
							 * len은 preData와 postData의 사이의 개수(빠져야함)
							 */
							if(dataArr[k] == super.getPostData()[j][0]){
								sChk = 0;
								for(int l=0;l<super.getPostData()[j].length;l++){
									if(dataArr[k+l] == super.getPostData()[j][l]){
										sChk++;
									}
									else{
										break;
									}
								}
								if(sChk == super.getPostData()[j].length){
									System.out.println("sChk : " + sChk);
									bArr = new byte[dataArr.length-len+this.updateData[j].length];

									System.arraycopy(dataArr, 0, bArr, 0, i+super.getPreData()[j].length);
									System.arraycopy(this.updateData[j], 0, bArr, i+super.getPreData()[j].length, this.updateData[j].length);
									System.arraycopy(dataArr, i+super.getPreData()[j].length+len, bArr, this.updateData[j].length+i+super.getPreData()[j].length, dataArr.length-i-len-super.getPreData()[j].length);

									startWidth.add(i);
									endWidth.add(i+super.getPreData()[j].length+len);
									
								}
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
package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingStream;

public abstract class MedianDataProcessFilter extends DataProcessFilter {

	private byte[][] preData;
	private byte[][] postData;

	public MedianDataProcessFilter(DockingStream stream, byte[][] preData, byte[][] postData) {
		super(stream);
		this.preData = preData;
		this.postData = postData;
		// TODO Auto-generated constructor stub
	}

	public byte[][] getPreData() {
		return preData;
	}

	public void setPreData(byte[][] preData) {
		this.preData = preData;
	}

	public byte[][] getPostData() {
		return postData;
	}

	public void setPostData(byte[][] postData) {
		this.postData = postData;
	}

	protected byte[] process(byte[] data, List<Integer> startWidth, List<Integer> endWidth) {
		byte[] dataTmp = data;
		byte[] tmp = dataTmp;

		int valCnt = 0;

		for(int i=0;i<dataTmp.length;i++){
			for(int j=0;j<preData.length;j++){
				if(dataTmp[i] == preData[j][0]){
					if(this.preData[j].length <= dataTmp.length-i){
						tmp = new byte[preData[j].length];	// updateTmp[i] 가 preData와 첫글자가 일치하면 데이터를 비교
						System.arraycopy(preData[j], 0, tmp, 0, preData[j].length);

						if(this.compare(tmp, preData[j])){

							valCnt = 0;
							for(int k=i+preData[j].length;k<dataTmp.length;k++,valCnt++){
								if(dataTmp[k] == postData[j][0]){
									if(this.postData[j].length <= dataTmp.length-i){
										tmp = new byte[postData[j].length];
										System.arraycopy(postData[j], 0, tmp, 0, postData[j].length);

										if(this.compare(tmp, postData[j])){
											tmp = this.operate(dataTmp, i, j, valCnt);

											startWidth.add(i);
											endWidth.add(i+valCnt);
										}
										dataTmp = tmp;
									}
									else{
										/*
										 * Data 의 남은 길이가 어차피 targetData 의 길이보다 짧을 경우
										 */
										break;
									}
								}
							}
						}
						else{
							/*
							 * postData 발견 못 한 경우..
							 */
						}
					}
					else{
						/*
						 * Data 의 남은 길이가 어차피 targetData 의 길이보다 짧을 경우
						 */
						break;
					}
				}
			}
		}
		return dataTmp;
	}

	abstract protected byte[] operate(byte[] data, int dataIndex, int srcIndex, int targetIndex);
}

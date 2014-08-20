package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.filter.Filter;

public class TargetCompareProcessFilter extends DataProcessFilter {

	private byte[][] srcData;
	private byte[][] targetData;

	private boolean targetEquals;

	public TargetCompareProcessFilter(DockingAnalyzer stream, byte[][] srcData, byte[][] targetData, boolean targetEquals) {
		super(stream);
		this.srcData = srcData;
		this.targetData = targetData;
		this.targetEquals = targetEquals;
		// TODO Auto-generated constructor stub
	}

	public byte[][] getSrcData() {
		return srcData;
	}

	public void setSrcData(byte[][] srcData) {
		this.srcData = srcData;
	}

	public byte[][] getTargetData() {
		return targetData;
	}

	public void setTargetData(byte[][] targetData) {
		this.targetData = targetData;
	}

	public boolean isTargetEquals() {
		return targetEquals;
	}

	public void setTargetEquals(boolean targetEquals) {
		this.targetEquals = targetEquals;
	}

	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth,
			List<Integer> endWidth) {
		byte[] dataTmp = data;
		byte[] tmp = dataTmp;

		for(int i=0;i<dataTmp.length;i++){
			for(int j=0;j<this.srcData.length;j++){
				if(dataTmp[i] == this.srcData[j][0]){

					if(this.srcData[j].length <= dataTmp.length-i){
						tmp = new byte[this.srcData[j].length];
						System.arraycopy(dataTmp, i, tmp, 0, this.srcData[j].length);

						if(this.compare(tmp, this.srcData[j])){

							/*
							 * 수행할 작업
							 */
							if(dataTmp[i+1] == this.targetData[j][0]){
								tmp = new byte[this.targetData[j].length];
								System.arraycopy(dataTmp, i+1, tmp, 0, this.targetData[j].length);
								if(this.targetEquals == true){
									if(this.compare(tmp, this.targetData[j])){
										
									}
								}
								else if(this.targetEquals == false){
									if(!this.compare(tmp, this.targetData[j])){

									}
								}
							}

							startWidth.add(i);
							endWidth.add(i+this.srcData[j].length);

							dataTmp = tmp;
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
}
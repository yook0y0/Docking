package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;

public abstract class SingleDataProcessFilter extends DataProcessFilter {

	private byte[][] targetData;
	
	public SingleDataProcessFilter(DockingAnalyzer stream, byte[][] targetData) {
		super(stream);
		this.targetData = targetData;
		// TODO Auto-generated constructor stub
	}
	
	public byte[][] getTargetData(){
		return this.targetData;
	}
	
	public void setTargetData(byte[][] targetData){
		this.targetData = targetData;
	}

	@Override
	protected byte[] process(byte[] data, List<Integer> startWidth,
			List<Integer> endWidth) {
		byte[] dataTmp = data;
		byte[] tmp = dataTmp;

		for(int i=0;i<dataTmp.length;i++){
			for(int j=0;j<this.targetData.length;j++){
				if(dataTmp[i] == this.targetData[j][0]){
					
					if(this.targetData[j].length <= dataTmp.length-i){
						tmp = new byte[this.targetData[j].length];
						System.arraycopy(dataTmp, i, tmp, 0, this.targetData[j].length);

						if(this.compare(tmp, this.targetData[j])){
							tmp = operate(dataTmp,i,j);

							startWidth.add(i);
							endWidth.add(i+this.targetData[j].length);

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
	
	abstract protected byte[] operate(byte[] data, int dataIndex, int srcIndex);
}

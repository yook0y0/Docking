package org.docking.erbse.analysis.filter.process;

import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;

public abstract class SingleDataProcessFilter extends DataProcessFilter {

	private byte[][] srcData;

	public SingleDataProcessFilter(DockingAnalyzer stream, byte[][] srcData) {
		super(stream);
		this.srcData = srcData;
		// TODO Auto-generated constructor stub
	}

	public byte[][] getSrcData(){
		return this.srcData;
	}

	public void setSrcData(byte[][] srcData){
		this.srcData = srcData;
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
							tmp = operate(dataTmp,i,j);

							if(tmp != null){
								startWidth.add(i);
								endWidth.add(i+this.srcData[j].length);

								dataTmp = tmp;
							}
						}
					}
					else{
						/*
						 * Data 의 남은 길이가 어차피 srcData 의 길이보다 짧을 경우
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

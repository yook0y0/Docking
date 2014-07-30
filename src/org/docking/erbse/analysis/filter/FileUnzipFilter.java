package org.docking.erbse.analysis.filter;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;


public class FileUnzipFilter extends Filter{

	private String encoding = "UTF-8";
	private byte[] buf = new byte[8 * 1024];

	public FileUnzipFilter(DockingAnalyzer da) {
		super(da);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub

		DataAttribute dAttr = null;
		InputStream is = null;

		String getData = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){

			dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

			if(dAttr.getProcess() == Attr.PROCESS_REGISTER){
				getData = new String(dAttr.getData()[0]);

				is = new FileInputStream(new File(getData));

				ZipArchiveInputStream zais = new ZipArchiveInputStream(is, encoding);
				ZipArchiveEntry zae = null;

				byte[] dat = null;
				byte[] tmp = null;

				List<byte[]> typeList = new ArrayList<byte[]>();
				List<byte[]> dataList = new ArrayList<byte[]>();

				int written = 0;		
				int writtenSize = 0;
				int tmpSize = 0;

				while((zae = zais.getNextZipEntry()) != null)
				{
					typeList.add(zae.getName().getBytes());

					writtenSize = 0;
					tmpSize = 0;
					dat = null;
					while ((written = zais.read(buf)) >= 0 ){
						
						writtenSize += written;

						tmp = dat;

						dat = new byte[writtenSize];

						if(tmp == null){
							tmpSize = 0;
						}
						else{
							tmpSize = tmp.length;
							for(int i=0;i<tmpSize;i++){
								dat[i] = tmp[i];
							}
						}
						int b = 0;
						for(int i=tmpSize;i<written+tmpSize;i++){
							dat[i] = buf[b];
							b++;
						}
					}
					if(dat == null){dat = new byte[1];}
					dataList.add(dat);
				}
				zais.close();

				if(typeList.size() != dataList.size()){
					// Error message
				}

				int size = typeList.size();
				byte[][] type = new byte[size][];
				byte[][] data = new byte[size][];

				for(int i=0;i<size;i++){
					type[i] = typeList.get(i);
					data[i] = dataList.get(i);
				}

				dAttr.setProcess(Attr.PROCESS_FILTER);
				dAttr.setType(type);
				dAttr.setData(data);

				this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
			}
			else {
				// Error Message..
			}
		}
		else{
			// Error Message..
		}
	}
}
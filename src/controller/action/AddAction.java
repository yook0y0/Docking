package controller.action;

import java.io.IOException;
import java.io.Reader;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.ContentsVO;
import vo.DockingEnvironmentVO;
import vo.EditorVO;
import vo.JoinedMemberVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class AddAction {
	
	public void addContents(String mapper, ContentsVO vo){
		GenericService<ContentsVO>	s = new GenericServiceImpl<ContentsVO>();
		s.add(mapper, vo);
	}
	
	public void addDockingEnvironment(String mapper, DockingEnvironmentVO vo){
		GenericService<DockingEnvironmentVO>	s = new GenericServiceImpl<DockingEnvironmentVO>();
		s.add(mapper, vo);
	}
	
	public void addEditor(String mapper, EditorVO vo){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.add(mapper, vo);
	}
		
	public void addJoinedMember(String mapper, JoinedMemberVO vo){
		GenericService<JoinedMemberVO>	s = new GenericServiceImpl<JoinedMemberVO>();
		s.add(mapper, vo);
	}
	
	public void addMember(String mapper, MemberVO vo){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.add(mapper, vo);		
	}
	
	public void addMemberContents(String mapper, MemberContentsVO vo){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.add(mapper, vo);
	}
	
	public void addTemp(String mapper, TempVO vo){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.add(mapper, vo);
	}
	
	/*
	 *  ......
	 */
	SqlSession	sqlSession = null;
	public void	tempConnect()
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
	}
	
	public void tempAdd(EditorVO editorVO)
	{
		sqlSession.selectList("editorCode_add", editorVO);
	}
	
	public void tempDisConnect()
	{
		sqlSession.close();
	}
}

package controller.action;

import java.io.IOException;
import java.io.Reader;
import java.util.List;

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

public class SearchAction {

	public ContentsVO searchContents(String mapper, String id){
		GenericService<ContentsVO>	s = new GenericServiceImpl<ContentsVO>();
		return s.search(mapper, id);
	}

	public DockingEnvironmentVO searchDockingEnvironment(String mapper, String id){
		GenericService<DockingEnvironmentVO>	s = new GenericServiceImpl<DockingEnvironmentVO>();
		return s.search(mapper, id);
	}

	public EditorVO searchEditor(String mapper, String id){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		return s.search(mapper, id);
	}

	public JoinedMemberVO searchJoinedMember(String mapper, String id){
		GenericService<JoinedMemberVO>	s = new GenericServiceImpl<JoinedMemberVO>();
		return s.search(mapper, id);
	}

	public MemberVO searchMember(String mapper, String id){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		return s.search(mapper, id);
	}

	public MemberContentsVO searchMemberContents(String mapper, String id){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		return s.search(mapper, id);
	}

	public TempVO searchTemp(String mapper, String id){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		return s.search(mapper, id);
	}

	public List<ContentsVO> searchAllContents(String mapper){
		GenericService<ContentsVO>s = new GenericServiceImpl<ContentsVO>();
		return s.searchAll(mapper);
	}

	public List<DockingEnvironmentVO> searchAllDockingEnvironment(String mapper){
		GenericService<DockingEnvironmentVO>s = new GenericServiceImpl<DockingEnvironmentVO>();
		return s.searchAll(mapper);
	}

	public List<EditorVO> searchAllEditor(String mapper){
		GenericService<EditorVO>s = new GenericServiceImpl<EditorVO>();
		return s.searchAll(mapper);
	}

	public List<JoinedMemberVO> searchAllJoinedMember(String mapper){
		GenericService<JoinedMemberVO>s = new GenericServiceImpl<JoinedMemberVO>();
		return s.searchAll(mapper);
	}

	public List<MemberVO> searchAllMember(String mapper){
		GenericService<MemberVO>s = new GenericServiceImpl<MemberVO>();
		return s.searchAll(mapper);
	}

	public List<MemberContentsVO> searchAllMemberContents(String mapper){
		GenericService<MemberContentsVO>s = new GenericServiceImpl<MemberContentsVO>();
		return s.searchAll(mapper);
	}

	public List<TempVO> searchAllTemp(String mapper){
		GenericService<TempVO>s = new GenericServiceImpl<TempVO>();
		return s.searchAll(mapper);
	}
	
	/*
	 * 
	 */
	public List<JoinedMemberVO>	searchJoinedMemberList(String mapper, String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
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
		
		List<JoinedMemberVO>	list = sqlSession.selectList(mapper, id);
		
		sqlSession.close();
		
		return list;
	}
	
	public List<MemberContentsVO>	searchMemberContentsList(String mapper, String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
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
		
		List<MemberContentsVO>	list = sqlSession.selectList(mapper, id);
		
		sqlSession.close();
		
		return list;
	}
}
